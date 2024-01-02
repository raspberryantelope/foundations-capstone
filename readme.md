# Media Tracker Application

## Description
Media Tracker is a web application designed to help users keep track of various media libraries such as movies, TV shows, music, and more. It allows users to add to, sort, and manage their media collections with ease.

## Features
- User authentication with login and registration functionality.
- Ability to add media items with details such as title, type, status, and image.
- Sorting options for media lists based on different criteria.
- Interactive front end with custom styling and responsive design.
- Server-side handling of GET, POST, and DELETE requests for media items.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node, Express
- **Database**: PostgreSQL with Sequelize
- **Styling**: Custom CSS with flexbox and animations
- **Fonts**: Custom web fonts integrated using @font-face
- **Session Management**: express-session
- **Password Hashing**: bcryptjs
- **API Testing**: Axios

## Installation and Setup
1. Clone the repository to your local machine.
2. Install the required dependencies using `npm install`.
3. Set up the PostgreSQL database and configure the `.env` file with your database credentials.
4. Run the server using `npm start` and navigate to `http://localhost:PORT` to access the application.

## Environment Variables
- [DATABASE_URL](file:///c%3A/Users/Alex/Desktop/DevMountain/Foundations%20Capstone/foundations-capstone/server/controllers/db.js#2%2C45-2%2C45): Connection string for the PostgreSQL database.
- [SESSION_SECRET](file:///c%3A/Users/Alex/Desktop/DevMountain/Foundations%20Capstone/foundations-capstone/server/server.js#16%2C25-16%2C25): Secret key for session management.

## Project Structure
- `public/`: Contains static files such as HTML, CSS, and client-side JavaScript.
- `models/`: Sequelize models for the database tables.
- `server/`: Server-side logic including routes and controllers.
- `protected/`: HTML files that require user authentication.

## Contributors
- [Alex Sutton](https://github.com/raspberryantelope)