const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.querySelector(".btncreate");

  registerBtn.addEventListener("click", () => {
    // Get values from input fields
    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const email = document.getElementById("mail").value.trim();
    const password = document.getElementById("pass").value.trim();

    // Basic validation
    if (!fname || !lname || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    // Send data to main process
    ipcRenderer.send("register-user", { fname, lname, email, password });
  });

  // Listen for response from main process
  ipcRenderer.on("register-status", (event, response) => {
    alert(response.message); // Show success/error message

    if (response.success) {
      window.location.href = "clientlogin.html"; // Redirect to login page
    }
  });
});
