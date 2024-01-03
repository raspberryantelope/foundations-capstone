function borderInvalid(fieldId) {
    const field = document.getElementById(`register-${fieldId}`)
    if (field) {
        field.classList.add("input-invalid")
    }
}
function disableRegister() {
    document.getElementById("register-button").disabled = document.getElementById("register-username").value === "" ||
        document.getElementById("register-email").value === "" ||
        document.getElementById("register-password").value === "" ||
        document.getElementById("register-confirm-password").value === ""
}
disableRegister()

function showToast(message) {
    const toast = document.createElement("div")
    toast.textContent = message
    toast.className = "toast-message"
    document.body.appendChild(toast)
    setTimeout(() => {
        toast.classList.add("show")
    }, 100)
    setTimeout(() => {
        toast.classList.remove("show")
        setTimeout(() => {
            document.body.removeChild(toast)
        }, 500)
    }, 5000)
}

let registerUsername = document.getElementById("register-username")
let registerUsernameMinLength = document.getElementById("username-requirements-length")
let registerUsernameMaxLength = document.getElementById("username-requirements-runon")
let registerUsernameSpecial = document.getElementById("username-requirements-special")
registerUsername.onfocus = function () {
    document.getElementById("username-requirements-message").style.display = "block"
}
registerUsername.onblur = function () {
    document.getElementById("username-requirements-message").style.display = "none"
}
registerUsername.onkeyup = function () {
    if (registerUsername.value.length < 3) {
        registerUsernameMinLength.classList.remove("valid")
        registerUsernameMinLength.classList.add("invalid")
    } else {
        registerUsernameMinLength.classList.remove("invalid")
        registerUsernameMinLength.classList.add("valid")
    }
    if (registerUsername.value.length > 64) {
        registerUsernameMaxLength.classList.remove("valid")
        registerUsernameMaxLength.classList.add("invalid")
    } else {
        registerUsernameMaxLength.classList.remove("invalid")
        registerUsernameMaxLength.classList.add("valid")
    }
    if (/[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/.test(registerUsername.value)) {
        registerUsernameSpecial.classList.remove("valid")
        registerUsernameSpecial.classList.add("invalid")
    } else {
        registerUsernameSpecial.classList.remove("invalid")
        registerUsernameSpecial.classList.add("valid")
    }
}


let registerPassword = document.getElementById("register-password")
let registerPasswordLowerLetter = document.getElementById("password-requirements-lower-letter")
let registerPasswordUpperLetter = document.getElementById("password-requirements-capital")
let registerPasswordNumber = document.getElementById("password-requirements-number")
let registerPasswordSpecial = document.getElementById("password-requirements-special")
let registerPasswordLength = document.getElementById("password-requirements-length")
registerPassword.onkeyup = function () {
    if (/[a-z]/.test(registerPassword.value)) {
        registerPasswordLowerLetter.classList.remove("invalid")
        registerPasswordLowerLetter.classList.add("valid")
    } else {
        registerPasswordLowerLetter.classList.remove("valid")
        registerPasswordLowerLetter.classList.add("invalid")
    }
    if (/[A-Z]/.test(registerPassword.value)) {
        registerPasswordUpperLetter.classList.remove("invalid")
        registerPasswordUpperLetter.classList.add("valid")
    } else {
        registerPasswordUpperLetter.classList.remove("valid")
        registerPasswordUpperLetter.classList.add("invalid")
    }
    if (/[0-9]/.test(registerPassword.value)) {
        registerPasswordNumber.classList.remove("invalid")
        registerPasswordNumber.classList.add("valid")
    } else {
        registerPasswordNumber.classList.remove("valid")
        registerPasswordNumber.classList.add("invalid")
}
    if (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(registerPassword.value)) {
        registerPasswordSpecial.classList.remove("invalid")
        registerPasswordSpecial.classList.add("valid")
    } else {
        registerPasswordSpecial.classList.remove("valid")
        registerPasswordSpecial.classList.add("invalid")
    }
    if (registerPassword.value.length < 8) {
        registerPasswordLength.classList.remove("valid")
        registerPasswordLength.classList.add("invalid")
    } else {
        registerPasswordLength.classList.remove("invalid")
        registerPasswordLength.classList.add("valid")
    }
}


document.getElementById("login-button").addEventListener("click", (event) => {
    event.preventDefault()
    const errorMessage = document.getElementById("login-error-message")
    const username = document.getElementById("login-username").value
    const password = document.getElementById("login-password").value
    axios
        .post("/api/login", { username, password })
        .then(response => {
            window.location.href = "/media"
        })
        .catch(error => {
            console.log(error)
            errorMessage.textContent = "Login failed. Please check your username and password and try again."
            errorMessage.classList.add("error-visible")
            document.getElementById("login-password").value = ""
        })
})


document.getElementById("register-button").addEventListener("click", (event) => {
    event.preventDefault()
    const errorMessage = document.getElementById("register-error-message")
    const username = document.getElementById("register-username").value
    const email = document.getElementById("register-email").value
    const password = document.getElementById("register-password").value
    const confirmPassword = document.getElementById("register-confirm-password").value

    axios.post("/api/register", { username, email, password, confirmPassword })
    .then(response => {
        showToast("Registration Successful")
        document.getElementById("register-form").reset()
    })
    .catch(error => {
        errorMessage.textContent = error.response && error.response.data
            ? error.response.data
            : "Registration failed. Please check the highlighted fields and try again."
        errorMessage.classList.add("error-visible")
        if (error.response && error.response.data) {
            const errorData = error.response.data
            if (errorData.includes("Username")) {
                borderInvalid("username")
                document.getElementById("register-username").focus()
            }
            if (errorData.includes("Email")) {
                borderInvalid("email")
                document.getElementById("register-email").focus()
            }
            if (errorData.includes("Password")) {
                borderInvalid("password")
                borderInvalid("confirm-password")
                document.getElementById("register-password").focus()
            }
        }
    })
})

document.querySelectorAll("#login-form input, #register-form input").forEach(input => {
    input.addEventListener("input", () => {
        input.classList.remove("input-invalid")
        const formType = input.closest("form").id.includes("login") ? "login" : "register"
        const errorMessage = document.getElementById(`${formType}-error-message`)
        errorMessage.textContent = ""
        errorMessage.classList.remove("error-visible")
        disableRegister()
    })
})

window.addEventListener("DOMContentLoaded", (event) => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("unauthorized")) {
        showToast("You must be logged in to access this page.")
    }
})


