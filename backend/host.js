const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",     // ✅ replace with the MySQL Host from Hostinger hPanel
  user: "root",         // ✅ your MySQL username
  password: "Samprithi004@",       // ✅ your MySQL password
  database: "real_estate", // ✅ your database name
  port: 3306                       // ✅ default MySQL port (make sure it's open)
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }
  console.log("✅ Connected to Hostinger MySQL Database");
});

const db1 = mysql.createConnection({
  host: "mysql.hostinger.com",     // ✅ replace with the MySQL Host from Hostinger hPanel
  user: "u351480125_root",         // ✅ your MySQL username
  password: "Samprithi004@",       // ✅ your MySQL password
  database: "u351480125_real_estate", // ✅ your database name
  port: 3306                       // ✅ default MySQL port (make sure it's open)
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    return;
  }
  console.log("✅ Connected to Hostinger MySQL Database");
});

module.exports = db1;
