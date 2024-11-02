const errorMsg = {
  "password-mismatch": "Las contraseñas no coinciden, por favor escríbelas de nuevo.",
  logged: "Esa cuenta ya está conectada.",
  "invalid-info": "El correo electrónico que proporcionaste no es válido.",
  takeninfo: "El nombre de usuario o correo electrónico que has proporcionado ya está en uso.",
  tooshort: "El nombre de usuario o contraseña que has proporcionado es demasiado corto",
  "incorrect-info": "El nombre de usuario o contraseña que has introducido es incorrecto.",
  "password-length": "La contraseña debe tener al menos 5 caracteres",
};

let showPass = {
  types: {
    'password': 'text',
    'text': 'password'
  },
  icons: {
    'password': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-eye-closed">
            <path d="m15 18-.722-3.25" />
            <path d="M2 8a10.645 10.645 0 0 0 20 0" />
            <path d="m20 15-1.726-2.05" />
            <path d="m4 15 1.726-2.05" />
            <path d="m9 18 .722-3.25" />
          </svg>`,
    'text': `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-eye">
            <path
              d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
          </svg>`
  }
}


if (document.querySelector('#btnEye')) {
  document.querySelector('#btnEye').addEventListener('click', (e) => {
    e.preventDefault();
    const target = e.target.closest('button')
    const fieldset = target.parentElement
    const input = fieldset.querySelector('input')
    input.type = showPass.types[input.type]
    target.innerHTML = showPass.icons[input.type]
  })
}


// Agregar esta función para validar el formulario
function validateForm() {
  if (document.querySelector('#loginForm')) {
    const loginName = document.getElementById("loginName").value.trim();
    const loginPass = document.getElementById("loginPass").value.trim();
    const submitButton = document.getElementById("loginBtn");
    submitButton.disabled = !(loginName && loginPass && loginPass.length >= 5);
  }

  if (document.querySelector('#registerForm')) {
    const registerName = document.getElementById("registerName").value.trim();
    const registerEmail = document.getElementById("registerEmail").value.trim();
    const registerPass = document.getElementById("registerPass").value.trim();
    const registerPass2 = document.getElementById("registerPass2").value.trim();
    const submitButton = document.getElementById("registerBtn");

    const isValidEmail = registerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    const isValidPassword = registerPass.length >= 5 && registerPass === registerPass2;

    submitButton.disabled = !(registerName && isValidEmail && isValidPassword);
  }
}

// Agregar los event listeners para los inputs
if (document.querySelector('#loginForm')) {
  document.getElementById("loginName").addEventListener("input", validateForm);
  document.getElementById("loginPass").addEventListener("input", validateForm);
}

if (document.querySelector('#registerForm')) {
  document.getElementById("registerName").addEventListener('input', validateForm)
  document.getElementById("registerEmail").addEventListener('input', validateForm)
  document.getElementById("registerPass").addEventListener('input', validateForm)
  document.getElementById("registerPass2").addEventListener('input', validateForm)
}

// Inicializar el estado del botón cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
  validateForm();
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
      const loginName = document.getElementById("loginName").value;
      const loginPass = document.getElementById("loginPass").value;

      if (!loginName || !loginPass) {
        throwError("invalid-info");
        return;
      }

      if (loginPass.length < 5) {
        throwError("password-length");
        return;
      }

      mp.trigger("client:loginData", loginName, loginPass);
      break;
    case 1:
      const registerName = document.getElementById("registerName").value;
      const registerEmail = document.getElementById("registerEmail").value;
      const registerPass = document.getElementById("registerPass").value;
      const registerPass2 = document.getElementById("registerPass2").value;

      if (registerPass.length < 5) {
        throwError("password-length");
        return;
      }

      if (!registerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throwError("invalid-info");
        return;
      }

      if (registerPass !== registerPass2) {
        throwError("password-mismatch");
        return;
      }

      mp.trigger("client:registerData", registerName, registerEmail, registerPass);
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
