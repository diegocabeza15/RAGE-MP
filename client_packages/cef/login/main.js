const errorMsg = {
  "password-mismatch": "Passwords do not match, please type them again.",
  logged: "That account is already logged in.",
  "invalid-info": "The email you provided is not valid.",
  takeninfo: "The username or email you have provided is taken.",
  tooshort: "The username or password you have provided is too short",
  incorrectinfo: "The username or password you have entered is incorrect.",
};

const closedEye = document.querySelector("#closedEye");
const openedEye = document.querySelector("#openedEye");
const passwordLogin = document.querySelector("#loginPass");

closedEye.addEventListener("click", () => {
  closedEye.classList.toggle("active");
  closedEye.classList.toggle("unActive");
  openedEye.classList.toggle("active");
  openedEye.classList.toggle("unActive");
  passwordLogin.setAttribute("type", "text");
});

openedEye.addEventListener("click", () => {
  closedEye.classList.toggle("active");
  closedEye.classList.toggle("unActive");
  openedEye.classList.toggle("active");
  openedEye.classList.toggle("unActive");
  passwordLogin.setAttribute("type", "password");
});

document
  .querySelectorAll(".alert")
  .forEach((alert) => (alert.style.display = "none"));

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
});

function sendAccountInfo(state) {
  document
    .querySelectorAll(".alert")
    .forEach((alert) => (alert.style.display = "none"));
  switch (state) {
    case 0:
      mp.events.call(
        "client:loginData",
        document.getElementById("loginName").value,
        document.getElementById("loginPass").value
      );
      break;
    case 1:
      if (
        document.getElementById("registerPass").value ==
        document.getElementById("registerPass2").value
      ) {
        mp.events.call(
          "client:registerData",
          document.getElementById("registerName").value,
          document.getElementById("registerEmail").value,
          document.getElementById("registerPass").value
        );
      } else {
        throwError("password-mismatch");
      }
      break;
    default:
      break;
  }
}

function throwError(err) {
  document.querySelectorAll(".alert").forEach((alert) => {
    alert.style.display = "block";
    alert.innerHTML = errorMsg[err];
  });
}

mp.events.add("b.throwError", (err) => {
  throwError(err);
});
