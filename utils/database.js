const sql = require("mysql2");

const db = sql.createPool();

module.exports = db.promise();
