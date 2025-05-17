const { app, BrowserWindow, ipcMain } = require("electron");
const mysql = require("mysql2");

// Create MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Default for XAMPP
  database: "xpectrumregister", // Your database name
});

connection.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as ID " + connection.threadId);
});

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile("clientregister.html");
});

// Handle user registration from renderer process
ipcMain.on("register-user", (event, userData) => {
  const { fname, lname, email, password } = userData;

  // Check if Email OR Password already exists
  const checkQuery = "SELECT * FROM register WHERE Email = ? OR Password = ?";

  connection.query(checkQuery, [email, password], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      event.reply("register-status", { success: false, message: "Database error!" });
      return;
    }

    if (results.length > 0) {
      event.reply("register-status", { success: false, message: "Email or Password already exists!" });
    } else {
      const insertQuery = "INSERT INTO register (Firstname, Lastname, Email, Password) VALUES (?, ?, ?, ?)";

      connection.query(insertQuery, [fname, lname, email, password], (insertErr, result) => {
        if (insertErr) {
          console.error("Error inserting data:", insertErr);
          event.reply("register-status", { success: false, message: "Registration failed!" });
        } else {
          console.log("User registered:", result);
          event.reply("register-status", { success: true, message: "User registered successfully!" });
        }
      });
    }
  });
});

// Handle user login from renderer process
ipcMain.on("login-user", (event, userData) => {
  const { email, password } = userData;

  const query = "SELECT Firstname, Lastname FROM register WHERE Email = ? AND Password = ?";

  connection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      event.reply("login-status", { success: false, message: "Database error!" });
      return;
    }

    if (results.length > 0) {
      const user = results[0]; // Get the user's first and last name
      console.log("Login successful for:", email);

      // Send success status with user data
      event.reply("login-status", { 
        success: true, 
        message: "Login successful!", 
        user: { fname: user.Firstname, lname: user.Lastname }
      });

      // Load Dashboard.html
      mainWindow.loadFile("Dashboard.html");
    } else {
      event.reply("login-status", { success: false, message: "Invalid email or password!" });
    }
  });
});

// Handle request for user details when Dashboard loads
ipcMain.on("get-user-data", (event) => {
  // This event is fired when `Dashboard.html` loads
  event.reply("user-data", userData); // Send user data to renderer
});
