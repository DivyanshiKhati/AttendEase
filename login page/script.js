const container = document.querySelector(".container");
const registerBtn = document.querySelector(".register-btn");
const loginBtn = document.querySelector(".login-btn");
const popup = document.getElementById("popupMessage");

function showPopup(message, bgColor = "#4caf50") {
  popup.textContent = message;
  popup.style.backgroundColor = bgColor;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000);
}

// Toggle view
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Allowed teacher accounts
const teacherAccounts = {
  teacher1: "pass123@@%",
  teacher2: "pass456",
  teacher3: "pass789",
};

// Handle forms
const registerForm = document.querySelector(".form-box.register form");
const loginForm = document.querySelector(".form-box.login form");

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showPopup(
      "Registered! But only pre-approved teachers can log in.",
      "#2196f3"
    );
    container.classList.remove("active");
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = loginForm.querySelector("input[type='text']").value.trim();
    const password = loginForm
      .querySelector("input[type='password']")
      .value.trim();

    if (teacherAccounts[username] && teacherAccounts[username] === password) {
      showPopup("You have logged in!", "#4caf50");
      setTimeout(() => {
        window.location.href = "../dashboard/index.html";
 // adjust path if needed
      }, 1500);

      // Redirect or do something here (e.g., window.location.href = "dashboard.html";)
    } else {
      showPopup(
        "Invalid credentials. Only authorized teachers allowed.",
        "#f44336"
      );
    }
  });
}
