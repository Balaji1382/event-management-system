const mysql = require("mysql2/promise");

const db = mysql.createPool({
    "user" : process.env.DB_USER,
    "password" : process.env.DB_PASSWORD,
    "database" : process.env.DB_NAME, 
    "connectionLimit" : 10,
    "waitForConnections" : true,
    "enableKeepAlive": true,
    "timezone" : "+00:00"
})

module.exports = { db };