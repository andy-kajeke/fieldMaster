const Sequelize = require('sequelize');
const db = require('../config/db_config');

module.exports = db.sequelize.define(
    'supervisonDetails', {
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
        handlerCurrentLatitude: {
            type: Sequelize.STRING
        },
        handlerCurrentLongitude: {
            type: Sequelize.STRING
        },
        checkListItemId: {
            type: Sequelize.STRING
        },
        checkListItemName: {
            type: Sequelize.STRING
        },
        checkListItemStatus: {
            type: Sequelize.BOOLEAN
        },
        supervisionStatus: {
            type: Sequelize.STRING
        },
        month: {
            type: Sequelize.STRING
        },
        year: {
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