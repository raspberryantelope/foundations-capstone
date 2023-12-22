let audio = document.getElementById("landing-audio")
audio.volume = 0.01
document.getElementById("landing-login-button").addEventListener("click", (event) => {
    window.location.href = "/login"
})
document.getElementById("landing-dashboard-button").addEventListener("click", (event) => {
    window.location.href = "/dashboard"
})

