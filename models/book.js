const { Model, DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    class Book extends Model {}

    Book.init({
        bookID: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        userID: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'userID'} },
        title: { type: DataTypes.STRING, allowNull: false },
        bookImg: { type: DataTypes.STRING, allowNull: true, validate: { isUrl: true } },
        checkStatus: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        status: { type: DataTypes.ENUM, values: ['Untouched', 'Complete', 'Complete (Low Quality)', 'Unfinished (Awaiting Release)', 'Unfinished (Incomplete)', 'Unreleased', 'White Whale'], allowNull: false }
    }, {
        sequelize,
        modelName: 'Book',
        timestamps: true,
        tableName: 'books'
    })
    return Book
}