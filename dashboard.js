document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById("userInfo");
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (user) {
      userInfo.innerHTML = `Welcome, ${user.fname} ${user.lname}!`;
    } else {
      userInfo.innerHTML = "No user data found!";
    }
  });
  