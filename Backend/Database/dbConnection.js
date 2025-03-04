const path = require('path');
const mssql = require('mssql');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const sqlConfig = {
	user: process.env.DB_USER,
	password: process.env.DB_PWD,
	database: process.env.DB_NAME,
	server: process.env.DB_SERVER,
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	},
	options: {
		encrypt: true, // for azure
		trustServerCertificate: true, // change to true for local dev / self-signed certs
	},
};

async function test() {
	try {
		const pool = await mssql.connect(sqlConfig);
		const result = await pool.request().query('SELECT * FROM Users');
		console.log(result.recordset);
	} catch (error) {
		console.error(error);
	}
}
// test();

module.exports = { sqlConfig };
