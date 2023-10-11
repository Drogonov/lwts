const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        "user",
        {
            id: {
                type: DataTypes.UUID,
                defaultValue:DataTypes.UUIDV4,
                primaryKey:true
            },
            chatId: { 
                type: DataTypes.INTEGER,
                allowNull: false 
            },
            name: { 
                type: DataTypes.STRING,
                allowNull: true 
            },
            howManyRoadsPassed: {
                type: DataTypes.INTEGER,
                allowNull: true 
            },
            chatHistory: { 
                type: DataTypes.TEXT,
                length: "long",
                allowNull: true,
            }
        },
        {
            charset: 'utf8', /* i add this two ligne here for generate the table with collation  = 'utf8_general_ci' test it and tell me ? */
            collate: 'utf8_general_ci'
        }
    );
  
    return User;
};