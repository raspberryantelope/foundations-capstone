let audio = document.getElementById("landing-audio")
audio.volume = 0.01

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

function checkLandingLoginStatus() {
    axios
        .get("/api/check-login")
        .then(response => {
            const flexButton = document.getElementById("landing-login-button")
            if (response.data.loggedIn) {
                sessionStorage.setItem("userID", response.data.userID)
                sessionStorage.setItem("username", response.data.username)
                const flexButton = document.getElementById("landing-login-button")
                flexButton.textContent = "My Media"
                flexButton.addEventListener("click", (event) => {
                    window.location.href = "/media"
                })
            } else {
                flexButton.addEventListener("click", (event) => {
                    window.location.href = "/login"
                })
            }
        })
        .catch(error => {
            console.log("Error checking login status:", error)
        })
}
checkLandingLoginStatus()

function displayUsername() {
    const username = sessionStorage.getItem("username")
    if (username) {
        const welcomeMessage = document.getElementById("header-welcome-message")
        welcomeMessage.textContent = `Welcome, ${username}`
    } else {
        const welcomeMessage = document.getElementById("header-welcome-message")
        if (welcomeMessage) {
        welcomeMessage.textContent = ""
    }
    }
}
displayUsername()

function logout() {
    axios
        .get("/logout")
        .then(() => {
            sessionStorage.clear()
            window.location.href = "/"
        })
        .catch(error => {
            console.log("Error logging out:", error)
        })
}
document.getElementById("landing-dashboard-button").addEventListener("click", (event) => {
    window.location.href = "/dashboard"
})

window.addEventListener("DOMContentLoaded", (event) => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has("logoutSuccess")) {
        showToast("You have been successfully logged out.")
    }
})


