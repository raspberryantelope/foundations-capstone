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
    .then(() => {
    console.log('Tables created')
    /*seedDatabase()*/
    })
    .catch(error => console.error('Error creating tables', error))

function seedDatabase() {
    Users.create({ /* ... user data ... */ })
    Movies.create({ /* ... movie data ... */ })
    TvShows.create({ /* ... show data ... */ })
    Music.create({ /* ... music data ... */ })
    Books.create({ /* ... book data ... */ })
    Audiobooks.create({ /* ... audiobook data ... */ })
}
