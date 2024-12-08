const pg = require('pg')
const { Pool } = pg
const CustomError = require('../errors/CustomError');
const HTTP_STATUS_CODE = require('../constants/httpStatusCode');
const date = require('date-fns');
require('dotenv').config();
class DataBase {
    constructor() {
        if (DataBase.instance) {

            return DataBase.instance
        }
        DataBase.instance = this;
        this.client = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        })
    }

    async getDataBase() {
        try {
            this.client.query(`SELECT * FROM Users`)
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async getUser(name) {
        try {
            const data = await this.client.query(`SELECT * FROM Users WHERE name = '${name}' `);
            return data
        } catch (error) {
            throw new CustomError({ error })
        }
    }
    async getUserByAuthToken(authToken) {
        try {
            const data = await this.client.query(`SELECT * FROM Sessions inner join Users on Sessions.person_id = Users.personid  WHERE authToken = '${authToken}'`);
            return data
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async getUserIdByRefToken(refToken) {
        try {
            const data = await this.client.query(`SELECT * FROM Sessions WHERE reftoken = '${refToken}'`);
            return data
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async validateUser(name, password) {
        try {
            const data = await this.client.query(`SELECT * FROM Users WHERE name = '${name}' AND password = '${password}'`);
            return data.rows[0]
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async setSession(personId, refToken, authToken) {
        try {
            await this.client.query(`
                INSERT INTO Sessions (person_id,reftoken, authtoken) VALUES ( '${personId}', '${refToken}', '${authToken}')`);
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async updateSession(personId, refToken, authToken) {
        try {
            await this.client.query(`
            UPDATE Sessions SET authtoken = '${authToken}', reftoken = '${refToken}' WHERE person_id = '${personId}'`);
        } catch (error) {

        }
    }

    async setUsers(name, password, refToken, authToken) {
        try {

            const user = await this.getUser(name);

            if (user.rows.length) {
                throw new CustomError({ message: 'User already exists!!!', status: HTTP_STATUS_CODE.BAD_REQUEST })
            }

            await this.client.query('BEGIN');
            const personId = await this.client.query(`
                INSERT INTO Users (name, password) VALUES ('${name}', '${password}') returning personid;`);
            await this.setSession(personId.rows[0].personid, refToken, authToken);
            await this.client.query('COMMIT');

        } catch (error) {
            await this.client.query('ROLLBACK');
            throw new CustomError({ error })
        }
    }

    async getListUsers() {
        try {
            this.client.query(`select * from users where role_id=2`);
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async getChats(userId) {
        try {
            const data = await this.client.query(`
                 with us as(select * from users_chats where user_id=${userId})
                 select m.chat_id, m.created, m.user_id, m.updated, m.text, m.id, m.readstatus, users.name from us u
                 join messages m on m.chat_id = u.chat_id 
                 join users on m.user_id=users.personid;`);
            return data.rows;
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async createMessage(chatId, userId, text) {
        try {
            const dateNow = date.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            await this.client.query(`insert into messages (chat_id, created, updated, text, user_id) values (${chatId}, '${dateNow}', '${dateNow}', '${text}', ${userId});`);
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async readMessages(ids) {
        try {
            await this.client.query(`update messages set readstatus = true where id in (${ids});`);
        } catch (error) {
            throw new CustomError({ error })
        }
    }
}

module.exports = DataBase;

//                INSERT INTO Sessions (name, password) VALUES ('${name}', '${password}')

// create table 'CREATE TABLE Users (PersonID int, Name varchar(255), RefToken varchar(255))'

//insert into  'INSERT INTO Users (PersonID, Name, RefToken) VALUES (1, 'John Doe', 'ref_token')'

// select from 'SELECT * FROM Users'

// const users = await this.client.query(`select id from messages`);
// const idsUsers = users.rows.map((item) => item.id);
// idsUsers.forEach((item, i) => {
//     const dateNow = date.format(new Date(new Date().setSeconds(i)), 'yyyy-MM-dd HH:mm:ss');
//     this.client.query(`update messages set created = '${dateNow}' where id = ${item};`);
// }) set time by loop