const pg = require('pg')
const { Pool } = pg
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
            throw Error(error)
        }
    }

    async getUser(id) {
        try {
            const data = await this.client.query(`SELECT * FROM Users WHERE PersonID = ${id}`);
            return data
        } catch (error) {
            throw Error(error)
        }
    }

    async setUsers(id, name, refToken) {
        try {
            const user = await this.getUser(id);
            if (user) {
                return;
            }
            this.client.query(`INSERT INTO Users (PersonID, Name, RefToken) VALUES (${id}, '${name}', '${refToken}')`);
        } catch (error) {
            throw Error(error)
        }
    }
}

module.exports = DataBase;

// create table 'CREATE TABLE Users (PersonID int, Name varchar(255), RefToken varchar(255))'

//insert into  'INSERT INTO Users (PersonID, Name, RefToken) VALUES (1, 'John Doe', 'ref_token')'

// select from 'SELECT * FROM Users'