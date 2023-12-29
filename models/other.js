const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Other extends Model {}

    Other.init({
        otherID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        userID: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'userID'} },
        title: { type: DataTypes.STRING, allowNull: false },
        otherImg: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
        checkStatus: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        status: { type: DataTypes.ENUM, values: ['Untouched', 'Complete', 'Complete (Low Quality)', 'Unfinished (Still Airing)', 'Unfinished (Incomplete)', 'Unreleased', 'White Whale'], allowNull: false }
    }, {
        sequelize,
        modelName: 'Other',
        timestamps: true,
        tableName: 'other'
    })
    return Other
}