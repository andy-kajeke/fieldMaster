const Sequelize = require('sequelize');
const db = require('../config/db_config');

module.exports = db.sequelize.define(
    'supervisionExecises', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            //autoIncrement: true
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
        agentHandlerName: {
            type: Sequelize.STRING
        },
        agentHandlerPhoneNumber: {
            type: Sequelize.STRING
        },
        agentDistrict: {
            type: Sequelize.STRING
        },
        agentTerritory: {
            type: Sequelize.STRING
        },
        supervisionLocation: {
            type: Sequelize.STRING
        },
        supervisionStatus: {
            type: Sequelize.STRING
        },
        supervisionStatusColor: {
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