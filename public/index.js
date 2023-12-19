function logButtonCheck() {
    let loggedIn = true
    if (loggedIn) {
        document.getElementById("log-button").innerHTML = "Logout"
    } else {
        document.getElementById("log-button").innerHTML = "Login"
    }
}
logButtonCheck()
document.getElementById("landing-login-button").addEventListener("click", (event) => {
    window.location.href = "login.html"
})
document.getElementById("landing-dashboard-button").addEventListener("click", (event) => {
    window.location.href = "dashboard.html"
})

