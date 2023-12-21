const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
})
const models = {
    users: require('../../models/user')(sequelize, Sequelize.DataTypes),
    movies: require('../../models/movie')(sequelize, Sequelize.DataTypes),
    shows: require('../../models/show')(sequelize, Sequelize.DataTypes),
    music: require('../../models/music')(sequelize, Sequelize.DataTypes),
    books: require('../../models/book')(sequelize, Sequelize.DataTypes),
    audiobooks: require('../../models/audiobook')(sequelize, Sequelize.DataTypes)
}

const getMedia = async (request, response) => {
    const mediaType = request.params.type
    const userID = request.session.userID
    try {
        const mediaList = await models[mediaType].findAll({where: { userID: userID }
        })
        response.json(mediaList)
    } catch (error) {
        response.status(500).send("Something went wrong")
    }
}

const addMediaItem = async (request, response) => {
//tbd
}

const deleteMediaItem = async (request, response) => {
//tbd
}

module.exports = {
    getMedia,
    addMediaItem,
    deleteMediaItem
}
