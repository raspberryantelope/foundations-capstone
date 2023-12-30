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

function checkLoginStatus() {
    axios
        .get("/api/check-login")
        .then(response => {
            if (response.data.loggedIn) {
                sessionStorage.setItem("userID", response.data.userID)
                sessionStorage.setItem("username", response.data.username)
            } else {
                showToast("You must be logged in to view this page")
                setTimeout(() => {
                    window.location.href = "/login"
                }, 5000)
            }
        })
        .catch(error => {
            console.log("Error checking login status:", error)
        })
}
checkLoginStatus()

function displayUsername() {
    const username = sessionStorage.getItem("username")
    if (username) {
        const welcomeMessage = document.getElementById("header-welcome-message")
        welcomeMessage.textContent = `Welcome, ${username}`
    }
}
displayUsername()

function logout() {
    axios
        .get("/logout")
        .then(() => {
            sessionStorage.clear()
            window.location.href = "/index.html/?logoutSuccess=1"
        })
        .catch(error => {
            console.log("Error logging out:", error)
        })
}

document.getElementById("logout-button").addEventListener("click", (event) => {
    event.preventDefault()
    logout()
})