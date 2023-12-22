const Sequelize = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
})
const MovieModel = require('../../models/movie')(sequelize, Sequelize.DataTypes)
const models = {
    users: require("../../models/user")(sequelize, Sequelize.DataTypes),
    movies: require('../../models/movie')(sequelize, Sequelize.DataTypes),
    shows: require('../../models/show')(sequelize, Sequelize.DataTypes),
    music: require('../../models/music')(sequelize, Sequelize.DataTypes),
    books: require('../../models/book')(sequelize, Sequelize.DataTypes),
    audiobooks: require('../../models/audiobook')(sequelize, Sequelize.DataTypes)
/*
    movies: MovieModel*/
}

const getMedia = async (request, response) => {
    console.log(request.params)
    console.log(request.session.userID)
    console.log(models)
    const mediaType = request.params.type
    const userID = request.session.userID
    try {
        const mediaList = await models[mediaType].findAll({where: { userID: userID }
        })
        response.json(mediaList)
    } catch (error) {
        console.error("Error getting media list:", error)
        response.status(500).send("Something went wrong")
    }
}

const addMediaItem = async (request, response) => {
    const mediaType = request.params.type
    const userID = request.session.userID
    const { title, image, checkStatus, status } = request.body
    console.log(userID)
    console.log("received media type for adding:", mediaType)
    console.log("Models object keys:", Object.keys(models))
    Object.entries(models).forEach(([key, value]) => {
        console.log(`Model for ${key}:`, value)
    })
    if (mediaType === "movie" && !MovieModel) {
        console.error("Movie model not defined")
        return response.status(500).send("Server configuration error")
    }

    console.log("Direct model access test:", await MovieModel.findAll())

    if (!models[mediaType]) {
        console.error("Invalid media type:", mediaType)
        return response.status(400).send("Invalid media type")
    }
    console.log("request body:", request.body)
    try {
        console.log("media type:", mediaType)
        const newMediaItem = await models[mediaType].create({
            userID,
            title,
            [`${mediaType}Img`]: image,
            checkStatus,
            status
        })
        response.status(201).json(newMediaItem)
    } catch (error) {
        console.log("Error adding media item:", error)
        response.status(500).send("Something went wrong while adding media item")
    }
}

const deleteMediaItem = async (request, response) => {
//tbd
}

module.exports = {
    getMedia,
    addMediaItem,
    deleteMediaItem
}
