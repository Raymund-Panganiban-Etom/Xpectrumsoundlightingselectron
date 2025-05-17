const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.querySelector(".btnlog");

  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("mail").value.trim();
    const password = document.getElementById("pass1").value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    // Send data to main process for authentication
    ipcRenderer.send("login-user", { email, password });
  });

  // Listen for login status from main process
  ipcRenderer.on("login-status", (event, response) => {
    if (response.success) {
      alert(response.message); // Show success message

      // Store user first name & last name in localStorage
      localStorage.setItem("user", JSON.stringify(response.user));

      // The page redirection is now handled by `main.js`
    } else {
      alert(response.message); // Show error message
    }
  });
});
