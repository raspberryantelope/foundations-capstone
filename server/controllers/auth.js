const bcrypt = require('bcryptjs')
// const users = require("SQL FILE HERE")
const users = []
module.exports = {
    login: async (request, response) => {
        let { username, password } = request.body
        let user = users.find(user => user.username === username)
        if (!user) {
            return response.status(400).send("User not found.")
        }
        try {
            let authenticated = await bcrypt.compare(password, user.passwordHash)
            if (authenticated) {
                let returnUser = {...user}
                delete returnUser.passwordHash
                response.status(200).send(returnUser)
            }
            else {
                response.status(401).send("Login failed.")
            }
        } catch (error) {
            response.status(500).send("Internal server error.")
        }
    },
    register: async (request, response) => {
        let { username, email, password, confirmPassword } = request.body
        if (users.some(user => user.username === username)) {
            return response.status(400).send("Username already exists.")
        }
        if (username.length < 3) {
            return response.status(400).send("Username must be at least 3 characters.")
        }
        if (username.length > 64) {
            return response.status(400).send("Username must be less than 64 characters.")
        }
        if (users.some(user => user.email === email)) {
            return response.status(400).send("Email already exists.")
        }
        if (password.length < 8) {
            return response.status(400).send("Password must be at least 8 characters.")
        }
        if (!/[a-z]/.test(password)) {
            return response.status(400).send("Password must contain at least one lowercase letter.")
        }
        if (!/[A-Z]/.test(password)) {
            return response.status(400).send("Password must contain at least one uppercase letter.")
        }
        if (!/[0-9]/.test(password)) {
            return response.status(400).send("Password must contain at least one number.")
        }
        if (password !== confirmPassword) {
            return response.status(400).send("Passwords do not match.")
        }
        try {
            let passwordHash = await bcrypt.hash(password, 10)
            let newUser = {
                username,
                email,
                passwordHash
            }
            //placeholder for actual DB logic
            users.push(newUser)

            let returnUser = {...newUser}
            delete returnUser.passwordHash
            console.log(users)
            response.status(201).send(returnUser)
        } catch (error) {
            response.status(500).send("An error occurred during registration.")
        }
    }
}