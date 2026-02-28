const { Sequelize } = require("sequelize");
// require("dotenv").config()

const db_name = process.env.DB_NAME
const username = process.env.USER_NAME
const password = process.env.PASSWORD
const host = process.env.HOST


const sequelize = new Sequelize(
    db_name,
    username,
    password,
    {
        host: host,
        dialect: "mysql",
        logging: true,
    }
);

module.exports = sequelize;