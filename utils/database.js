const sql = require("mysql2");

const db = sql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "7himkoli",
});

module.exports = db.promise();
