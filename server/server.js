const express = require("express")
const session = require("express-session")
require("dotenv").config({ path: "../.env" })
const cors = require("cors")
const path = require("path")
const bodyParser = require('body-parser')
const app = express()
const authController = require("./controllers/auth")
const PORT = process.env.SERVER_PORT
const SECRET = process.env.SESSION_SECRET
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))
app.get("/fonts/*", (request, response) => {
    response.sendFile(path.join(__dirname, '../public', request.url))
})

app.post("/api/login", authController.login)
app.post("/api/register", authController.register)

app.get("*", (request, response) => {
    if (!request.path.startsWith("/api")) {
        response.sendFile(path.join(__dirname, '../public', 'index.html'))
    } else {
        response.status(404).send("Not Found")
    }
})
app.listen(PORT, () => console.log("Server running on port 4000"))
/*
// Set up EJS as the view engine. We'll use this to serve pages from the views/ directory.
// For example, res.render("index") will render views/index.ejs.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Built-in middleware to extract data from req.body.
app.use(express.urlencoded({ extended: false }));

const restrict = (request, response, next) => {
    if (request.session.username) {
        next();
    } else {
        request.session.error =
            "Access denied! Try logging in again or create a new account.";
        response.redirect("/");
    }
};

// The homepage.
app.get("/", (req, res) => {
    res.render("index");
});

// A restricted route that can only be accessed if the user is logged in.
app.get("/login/success", restrict, (req, res) => {
    res.render("login-success", { username: req.session.username });
});

// Destroy the user's session cookie to log them out.
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});*/