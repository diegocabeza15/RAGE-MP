const closedEye = document.querySelector("#closedEye");
const openedEye = document.querySelector("#openedEye");
const passwordLogin = document.querySelector("#registerPass");
const passwordLogin2 = document.querySelector("#registerPass2")

closedEye.addEventListener("click", () => {
  closedEye.classList.toggle("active");
  closedEye.classList.toggle("unActive");
  openedEye.classList.toggle("active");
  openedEye.classList.toggle("unActive");
  passwordLogin.setAttribute("type", "text");
  passwordLogin2.setAttribute("type", "text");
});

openedEye.addEventListener("click", () => {
  closedEye.classList.toggle("active");
  closedEye.classList.toggle("unActive");
  openedEye.classList.toggle("active");
  openedEye.classList.toggle("unActive");
  passwordLogin.setAttribute("type", "password");
  passwordLogin2.setAttribute("type", "password");
});