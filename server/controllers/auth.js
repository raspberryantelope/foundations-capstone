const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
})
const users = require('../../models/user')(sequelize, Sequelize.DataTypes)
module.exports = {
    login: async (request, response) => {
        let {username, password} = request.body
        try {
            let user = await users.findOne({where: {username: username}})
            if (!user) {
                return response.status(400).send("User not found.")
            }
            let authenticated = await bcrypt.compare(password, user.passwordHash)
            if (authenticated) {
                request.session.userID = user.userID
                request.session.username = user.username
                let returnUser = {...user.get()}
                delete returnUser.passwordHash
                response.status(200).send(returnUser)
            } else {
                response.status(401).send("Login failed.")
            }
        } catch (error) {
            response.status(500).send("Internal server error." + error)
        }
    },

    register: async (request, response) => {
        let {username, email, password, confirmPassword} = request.body
        try {
            let existingUser = await users.findOne({
                where: {
                    [Sequelize.Op.or]: [{username: username}, {email: email}]
                }
            })
            if (existingUser) {
                if (existingUser.username === username) {
                    return response.status(400).send("Username already exists.")
                }
                if (existingUser.email === email) {
                    return response.status(400).send("Email already exists.")
                }
            }
            if (username.length < 3) {
                return response.status(400).send("Username must be at least 3 characters.")
            }
            if (username.length > 64) {
                return response.status(400).send("Username must be less than 64 characters.")
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
            let passwordHash = await bcrypt.hash(password, 10)
            let newUser = await users.create({
                username,
                email,
                passwordHash
            })
            let returnUser = newUser.get({plain: true})
            delete returnUser.passwordHash
            response.status(201).send(returnUser)
        } catch (error) {
            console.error("Stack", error.stack)
            if (error.name === "SequelizeValidationError") {
                console.log("Validation errors:", error.errors)
                const messages = error.errors.map(error => error.message)
                response.status(400).send(`Validation errors: ${messages.join(", ")}`)
            } else {
                response.status(500).send("An error occurred during registration: " + error)
            }
        }
    }
}

