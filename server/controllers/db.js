const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
})
const Users = require('../../models/user')(sequelize, Sequelize.DataTypes)
const Movies = require('../../models/movie')(sequelize, Sequelize.DataTypes)
const TvShows = require('../../models/show')(sequelize, Sequelize.DataTypes)
const Music = require('../../models/music')(sequelize, Sequelize.DataTypes)
const Books = require('../../models/book')(sequelize, Sequelize.DataTypes)
const Audiobooks = require('../../models/audiobook')(sequelize, Sequelize.DataTypes)

sequelize
    .sync({ force: true })
    .then(async () => {
    console.log('Tables created')
    await seedDatabase()
    console.log('Database seeded')
    })
    .catch(error => console.error('Error creating tables', error))

async function seedDatabase() {
    await Users.create({
        username: "testes",
        passwordHash: "test",
        email: "test2@test.com",
        profilePic: "test.com",
        about: "test",
        joinDate: new Date()
    })
    await Movies.create({
        userID: 1,
        title: "The Godfather",
        movieImg: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
        checkStatus: false,
        status: "Untouched"
    })
    await TvShows.create({
        userID: 1,
        title: "Game of Thrones",
        showImg: "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTczLWJiYmYtZGRkZjlhNGM0NjJhXkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_.jpg",
        checkStatus: false,
        status: "Untouched"
    })
    await Music.create({
        userID: 1,
        title: "After Me",
        musicImg: "https://upload.wikimedia.org/wikipedia/en/0/0b/AfterMe.jpg",
        checkStatus: false,
        status: "Untouched"
    })
    await Books.create({
        userID: 1,
        title: "The Catcher in the Rye",
        bookImg: "https://upload.wikimedia.org/wikipedia/en/1/13/The_Catcher_in_the_Rye.jpg",
        checkStatus: false,
        status: "Untouched"
    })
    await Audiobooks.create({
        userID: 1,
        title: "The Catcher in the Rye",
        audiobookImg: "https://upload.wikimedia.org/wikipedia/en/1/13/The_Catcher_in_the_Rye.jpg",
        checkStatus: false,
        status: "Untouched"
    })
}

