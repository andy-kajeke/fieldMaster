const Sequelize = require('sequelize');
const db = require('../config/db_config');

module.exports = db.sequelize.define(
    'agentDetails', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        agentId: {
            type: Sequelize.STRING
        },
        agentName: {
            type: Sequelize.STRING
        },
        agentPhoneNumber: {
            type: Sequelize.STRING
        },
        agentRegion: {
            type: Sequelize.STRING
        },
        agentHandlerName: {
            type: Sequelize.STRING
        },
        agentHandlerPhoneNumber: {
            type: Sequelize.STRING
        },
        agentHandlerEmail: {
            type: Sequelize.STRING
        },
        agentDistrict: {
            type: Sequelize.STRING
        },
        agentTerritory: {
            type: Sequelize.STRING
        },
        agentTerritoryLatitude: {
            type: Sequelize.STRING
        },
        agentTerritoryLongitude: {
            type: Sequelize.STRING
        },
        agentPhoto: {
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