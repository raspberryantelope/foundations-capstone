const Sequelize = require('sequelize')
const { where } = require("sequelize")
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
})

const models = {
    user: require("../../models/user")(sequelize, Sequelize.DataTypes),
    movie: require('../../models/movie')(sequelize, Sequelize.DataTypes),
    show: require('../../models/show')(sequelize, Sequelize.DataTypes),
    music: require('../../models/music')(sequelize, Sequelize.DataTypes),
    book: require('../../models/book')(sequelize, Sequelize.DataTypes),
    audiobook: require('../../models/audiobook')(sequelize, Sequelize.DataTypes),
    other: require('../../models/other')(sequelize, Sequelize.DataTypes)
}

const getMedia = async (request, response) => {
    const mediaType = request.params.type
    const userID = request.session.userID
    const sortBy = request.query.sortBy || "title"
    const sortOrder = request.query.sortOrder || "ASC"
    try {
        const mediaList = await models[mediaType].findAll({where: { userID: userID }, order: [sortBy === "status" ? [Sequelize.fn("lower", Sequelize.cast(Sequelize.col(sortBy), "text")), sortOrder.toUpperCase()] : [sortBy, sortOrder.toUpperCase()]]})
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

    if (!models[mediaType]) {
        console.error("Invalid media type:", mediaType)
        return response.status(400).send("Invalid media type")
    }
    try {
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
    const mediaType = request.params.type
    const mediaID = request.params.id
    const idKey = `${mediaType}ID`
    try {
        await models[mediaType].destroy({where: {[idKey]: mediaID}})
        response.sendStatus(204)
    } catch (error) {
        console.log("Error deleting media item:", error)
        response.status(500).send("Something went wrong while deleting media item")
    }
}

const updateMediaItem = async (request, response) => {
    const mediaType = request.params.type
    const mediaID = request.params.id
    const { title, checkStatus, status } = request.body
    const imageKey = `${mediaType}Img`
    const imageValue = request.body[imageKey]
    try {
        const primaryKey = `${mediaType}ID`

        const mediaItem = await models[mediaType].findByPk(mediaID)
        if (mediaItem) {
            mediaItem.title = title
            mediaItem[imageKey] = imageValue
            mediaItem.checkStatus = checkStatus
            mediaItem.status = status

            await mediaItem.save()
            response.json(mediaItem)
        } else {
            response.status(404).send("Media item not found")
        }
    } catch (error) {
        console.log("Error updating media item:", error)
        response.status(500).send("Something went wrong while updating media item")
    }
}

module.exports = {
    getMedia,
    addMediaItem,
    deleteMediaItem,
    updateMediaItem
}
