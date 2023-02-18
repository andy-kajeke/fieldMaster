const Sequelize = require('sequelize');
const db = require('../config/db_config');

module.exports = db.sequelize.define(
    'supervisorDetails', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        supervisorId: {
            type: Sequelize.STRING
        },
        supervisorName: {
            type: Sequelize.STRING
        },
        supervisorPhoneNumber: {
            type: Sequelize.STRING
        },
        supervisorEmail: {
            type: Sequelize.STRING
        },
        supervisorPhoto: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        resetCode: {
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