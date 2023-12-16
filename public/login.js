document.getElementById("login-button").addEventListener("click", (event) => {
    event.preventDefault();
    const errorMessage = document.getElementById("login-error-message");
    errorMessage.textContent = "Login failed. Please check your username and password and try again.";
    errorMessage.classList.add("error-visible");
});

document.getElementById("register-button").addEventListener("click", (event) => {
    event.preventDefault();
    const errorMessage = document.getElementById("register-error-message");
    errorMessage.textContent = "Registration failed. Please check the highlighted fields and try again.";
    errorMessage.classList.add("error-visible");
});

document.querySelectorAll("#login-form input").forEach(input => {
    input.addEventListener("input", () => {
        const errorMessage = document.getElementById("login-error-message");
        errorMessage.textContent = "";
        errorMessage.classList.remove("error-visible");
    });
});

document.querySelectorAll("#register-form input").forEach(input => {
    input.addEventListener("input", () => {
        const errorMessage = document.getElementById("register-error-message");
        errorMessage.textContent = "";
        errorMessage.classList.remove("error-visible");
    });
})