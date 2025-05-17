// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 3/23/25
// ALL !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
const mysql = require("mysql2");

// Create MySQL connection
const connection = mysql.createConnection({
  host: "localhost",  // XAMPP MySQL runs on localhost
  user: "root",       // Default XAMPP user
  password: "",       // Default is empty
  database: "xpectrumregister", // Change this to your database name
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as ID " + connection.threadId);
});

module.exports = connection; // Export the connection for use in main.js
