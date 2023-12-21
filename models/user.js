const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class User extends Model {}

    User.init({
        userID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        username: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { len: [3, 64] } },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
        profilePic: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
        about: { type: DataTypes.TEXT, allowNull: true },
        joinDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
        sequelize,
        modelName: 'User',
        timestamps: false,
        tableName: 'users'
    })
    return User
}