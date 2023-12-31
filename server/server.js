require("dotenv").config({ path: "./.env" })
const express = require("express")
const session = require("express-session")
const cors = require("cors")
const path = require("path")
const bodyParser = require('body-parser')
const app = express()
const authController = require("./controllers/auth")
const mediaController = require("./controllers/media")

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }
}))

app.get("/fonts/*", (request, response) => {
    response.sendFile(path.join(__dirname, '../public', request.url))
})

const restrict = (request, response, next) => {
    if (request.session.userID) {
        next()
    } else {
        response.redirect("/login?unauthorized=1")
    }
}

app.get("/login", (request, response) => {
    response.sendFile(path.join(__dirname, '../public', 'login.html'))
})

app.post("/api/login", authController.login)
app.post("/api/register", authController.register)

app.get("/api/check-login", (request, response) => {
    if (request.session.userID) {
        response.json({ loggedIn: true, userID: request.session.userID, username: request.session.username })
    } else {
        response.json({ loggedIn: false })
    }
})

app.get("/logout", (request, response) => {
    request.session.destroy(error => {
        if (error) {
            response.status(500).send("Something went wrong")
        } else {
            response.redirect("/?logoutSuccess=1")
        }
    })
})

app.get("/dashboard", restrict, (request, response) => {
    response.sendFile(path.join(__dirname, '../protected', 'dashboard.html'))
})

app.get("/profile", restrict, (request, response) => {
    response.sendFile(path.join(__dirname, '../protected', 'profile.html'))
})

app.get("/media", restrict, (request, response) => {
    response.sendFile(path.join(__dirname, '../protected', 'media.html'))
})

app.get("/api/media/:type", restrict, mediaController.getMedia)
app.post("/api/media/:type", restrict, mediaController.addMediaItem)
app.delete("/api/media/:type/:id", restrict, mediaController.deleteMediaItem)
app.put("/api/media/:type/:id", restrict, mediaController.updateMediaItem)

app.use(express.static(path.join(__dirname, '../public')))

app.get("*", (request, response) => {
    if (!request.path.startsWith("/api")) {
        response.sendFile(path.join(__dirname, '../public', 'index.html'))
    } else {
        response.status(404).send("Not Found")
    }
})

require("./controllers/db")
app.listen(process.env.SERVER_PORT, () => console.log(`Server running on port ${process.env.SERVER_PORT}`))
