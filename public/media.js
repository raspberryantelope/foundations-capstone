function logButtonCheck() {
    let loggedIn = true
    if (loggedIn) {
        document.getElementById("log-button").innerHTML = "Logout"
    } else {
        document.getElementById("log-button").innerHTML = "Login"
    }
}
logButtonCheck()