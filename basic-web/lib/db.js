const mysql = require("mysql");
require("dotenv").config();

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.DB_PASSWORD,
	database: "dimigo",
});

// const db = mysql.createConnection({
// 	host: "172.16.2.102",
// 	user: "root",
// 	password: "1234",
// 	database: "musik",
// });

db.connect();

module.exports = db;