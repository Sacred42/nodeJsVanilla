const pg = require('pg')
const { Pool } = pg
const CustomError = require('../errors/CustomError');
const HTTP_STATUS_CODE = require('../constants/httpStatusCode');
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
            const data = await this.client.query(`SELECT * FROM Users WHERE name = '${name}'`);
            return data
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async validateUser(name, password) {
        try {
            const data = await this.client.query(`SELECT * FROM Users WHERE name = '${name}' AND password = '${password}'`);
            return data.rows.length
        } catch (error) {
            throw new CustomError({ error })
        }
    }

    async setUsers(name, password, refToken) {
        try {

            const user = await this.getUser(name);
            if (user.rows.length) {
                throw new CustomError({ message: 'User already exists!!!', status: HTTP_STATUS_CODE.BAD_REQUEST })
            }
            this.client.query(`INSERT INTO Users (Name, RefToken, role_id, password) VALUES ('${name}', '${refToken}', ${1}, '${password}')`);
        } catch (error) {
            throw new CustomError({ error })
        }
    }
}

module.exports = DataBase;

// create table 'CREATE TABLE Users (PersonID int, Name varchar(255), RefToken varchar(255))'

//insert into  'INSERT INTO Users (PersonID, Name, RefToken) VALUES (1, 'John Doe', 'ref_token')'

// select from 'SELECT * FROM Users'