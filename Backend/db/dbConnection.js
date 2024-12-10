require("dotenv").config();
const mysql = require("mysql2"); // Ensure this line is present

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'report',
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  } else {
    console.log("Connected to MySQL");
  }
});

module.exports = db;
