const Sequelize = require('sequelize');
const db = require('../config/db_config');

module.exports = db.sequelize.define(
    'checkListItems', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        itemName: {
            type: Sequelize.STRING
        },
        created_at: {
            type: Sequelize.STRING
        },
        updated_at: {
            type: Sequelize.STRING
        }
        

    }, {
        timestamps: false
    }
);