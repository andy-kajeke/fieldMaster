const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const salt = genSaltSync(10);
const AgentModel = require('../models/agentDetails.model');
const SupervisorModel = require('../models/supervisorDetails.model');
const SupervisonModel = require('../models/supervisionDetails.model');
const CheckListItemsModel = require('../models/checkListItems.model');

/*********************************************************************************************
 * Register new agent details to DB
**********************************************************************************************/
const AddNewAgent = async(req, res) => {
    const { v4: uuidv4 } = require('uuid');

    var date = new Date();
    let today = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);

    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var realHour = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var currentTime = realHour + ':' + minutes + ':' + seconds + ' ' + ampm;

    /**password */
    var password = req.body.agentPhoneNumber;
    var agentPassword = password.slice(-5);

    try {
        await AgentModel.findOne({
            where: { agentId: req.body.agentId}
        })
        .then(isAgent => {
            if(!isAgent){
                SupervisorModel.findOne({
                    where: { supervisorName: req.body.agentHandlerName }
                })
                .then(isSupervisor => {
                    const agentData = {
                        id: uuidv4(),
                        agentId: req.body.agentId,
                        agentName: req.body.agentName,
                        agentPhoneNumber: req.body.agentPhoneNumber,
                        agentHandlerName: req.body.agentHandlerName,
                        agentHandlerPhoneNumber: isSupervisor.supervisorPhoneNumber,
                        agentHandlerEmail: isSupervisor.supervisorEmail,
                        agentRegion: req.body.agentRegion,
                        agentDistrict: req.body.agentDistrict,
                        agentTerritory: req.body.agentTerritory,
                        agentTerritoryLatitude: '0.00',
                        agentTerritoryLongitude: '0.00',
                        agentPhoto: process.env.IMAGE_URL + '/profile_photo/holder.png',
                        password: hashSync(agentPassword, salt),
                        resetCode: '',
                        created_at: today,
                        updated_at: today + ' ' + currentTime
                    }

                    AgentModel.create(agentData)
                    .then(agent => {
                        CheckListItemsModel.findAll()
                        .then(items => {
                            if(items.length != 0){
                                let count = 0;

                                items.forEach(element => {
                                    const { v4: uuidv4 } = require('uuid');
                                    count++;
    
                                    const supervisionData = {
                                        id: uuidv4(),
                                        agentId: agent.agentId,
                                        agentName: agent.agentName,
                                        agentPhoneNumber: agent.agentPhoneNumber,
                                        agentRegion: agent.agentRegion,
                                        agentHandlerName: agent.agentHandlerName,
                                        agentHandlerPhoneNumber: agent.agentHandlerPhoneNumber,
                                        agentHandlerEmail: agent.agentHandlerEmail,
                                        agentDistrict: agent.agentDistrict,
                                        agentTerritory: agent.agentTerritory,
                                        agentTerritoryLatitude: agent.agentTerritoryLatitude,
                                        agentTerritoryLongitude: agent.agentTerritoryLongitude,
                                        agentPhoto: agent.agentPhoto,
                                        handlerCurrentLatitude: '0.0',
                                        handlerCurrentLongitude: '0.0',
                                        checkListItemId: element.id,
                                        checkListItemName: element.itemName,
                                        checkListItemStatus: '0',
                                        supervisionStatus: 'Pending',
                                        month: monthNames[date.getMonth()],
                                        year: date.getFullYear(),
                                        created_at: today,
                                        updated_at: today + ' ' + currentTime
                                    }
    
                                    SupervisonModel.create(supervisionData)
                                });

                                if(count === items.length){
                                    res.json({
                                        status: `Success`,
                                        message: agent.agentName + ` has been registered successfully...`
                                    });
                                }
                            }
                            else{
                                res.json({
                                    status: 'Success',
                                    message: agent.agentName + ' has been registered successfully...'
                                });
                            }
                        })
                        .catch (error => {
                            res.json({
                                status: 'Failed',
                                message: error
                            });
                        });

                    })
                    .catch (error => {
                        res.json({
                            status: 'Failed',
                            message: error
                        });
                    });
                })
                .catch (error => {
                    res.json({
                        status: 'Failed',
                        message: error
                    });
                });
            }else{
                res.json({
                    status: 'Failed',
                    message: 'Agent ID already exists'
                });
            }
        })
        .catch (error => {
            res.json({
                status: 'Failed',
                message: error
            });
        });
    } catch (error) {
        res.json({
            status: 'Failed',
            message: error
        });
    }
};

/*********************************************************************************************
 * Get all registered agents details from DB
**********************************************************************************************/
const GetAllAgents = async(req, res) => {
    try {
        await AgentModel.findAll()
        .then(agents => {
            res.json({agents});
        })
        .catch (error => {
            res.json({
                status: 'Failed',
                message: error
            });
        });
    } catch (error) {
        res.json({
            status: 'Failed',
            message: error
        });
    }
};

/*********************************************************************************************
 * Get all registered agents details from DB by supervisor
**********************************************************************************************/
const GetAllAgentsBySupervisorEmail = async(req, res, next) => {
    try {
        await AgentModel.findAll({
            where: { agentHandlerEmail: req.params.agentHandlerEmail }
        })
        .then(agents => {
            res.json({agents});
        })
        .catch (error => {
            res.json({
                status: 'Failed',
                message: error
            });
        });
    } catch (error) {
        res.json({
            status: 'Failed',
            message: error
        });
        console.log('error ==> ', error)
    }
};

/*********************************************************************************************
 * Get all registered agents details from DB by district
**********************************************************************************************/
const GetAllAgentsByDistrict = async(req, res) => {
    try {
        await AgentModel.findAll({
            where: { agentDistrict: req.params.agentDistrict }
        })
        .then(agents => {
            res.json({agents});
        })
        .catch (error => {
            res.json({
                status: 'Failed',
                message: error
            });
        });
    } catch (error) {
        res.json({
            status: 'Failed',
            message: error
        });
    }
};

/*********************************************************************************************
 * Get all registered agents details from DB by territory
**********************************************************************************************/
const GetAllAgentsByTerritory = async(req, res) => {
    try {
        await AgentModel.findAll({
            where: { agentTerritory: res.params.agentTerritory }
        })
        .then(agents => {
            res.json({agents});
        })
        .catch (error => {
            res.json({
                status: 'Failed',
                message: error
            });
        });
    } catch (error) {
        res.json({
            status: 'Failed',
            message: error
        });
    }
};

/*********************************************************************************************
 * Get registered agents details from DB by agentId
**********************************************************************************************/
const GetAgentByID = async(req, res) => {
    try {
        await AgentModel.findOne({
            where: { agentId: req.params.agentId }
        })
        .then(agent => {
            res.json({agent});
        })
        .catch (error => {
            res.json({
                status: 'Failed',
                message: error
            });
        });
    } catch (error) {
        res.json({
            status: 'Failed',
            message: error
        });
    }
};

/*********************************************************************************************
 * Update registered agent details in DB
**********************************************************************************************/
const EditAgentInfo = async(req, res) => {
    var date = new Date();
    let today = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);

    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var realHour = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    var currentTime = realHour + ':' + minutes + ':' + seconds + ' ' + ampm;

    try {
        await AgentModel.findOne({
            where: { agentId: req.params.agentId }
        })
        .then(agent => {
            if(agent){
                SupervisorModel.findOne({
                    where: { supervisorName: req.body.agentHandlerName }
                })
                .then(isSupervisor => {
                    const agentData = {
                        agentName: req.body.agentName,
                        agentPhoneNumber: req.body.agentPhoneNumber,
                        agentHandlerName: req.body.agentHandlerName,
                        agentHandlerPhoneNumber: isSupervisor.supervisorPhoneNumber,
                        agentHandlerEmail: isSupervisor.supervisorEmail,
                        agentRegion: req.body.agentRegion,
                        agentDistrict: req.body.agentDistrict,
                        agentTerritory: req.body.agentTerritory,
                        agentTerritoryLatitude: req.body.agentTerritoryLatitude,
                        agentTerritoryLongitude: req.body.agentTerritoryLongitude,
                        updated_at: today + ' ' + currentTime
                    }

                    AgentModel.update(agentData, {
                        where: { agentId: res.params.agentId }
                    })
                    .then(() => {
                        res.json({
                            status: 'Success',
                            message: 'Record updated successfully...'
                        });
                    })
                    .catch (error => {
                        res.json({
                            status: 'Failed',
                            message: error
                        });
                    });
                })
                .catch (error => {
                    res.json({
                        status: 'Failed',
                        message: error
                    });
                });
            }else{
                res.json({
                    status: 'Failed',
                    message: 'Record not found'
                });
            }
        })
        .catch (error => {
            res.json({
                status: 'Failed',
                message: error
            });
        });
    } catch (error) {
        res.json({
            status: 'Failed',
            message: error
        });
    }
};

/*********************************************************************************************
 * Upload agent profile pic
**********************************************************************************************/
const UploadAgentProfilePic = async(req, res) => {
    AgentModel.update({
        agentPhoto: process.env.IMAGE_URL + '/profile_photo/' + req.file.originalname,
    },{
        where:{
            id: req.params.id
        }
    }).then(items => {
        res.json({ message: 'Photo uploaded successfully' })
    });
};

/*********************************************************************************************
 * Delete or remove registered agent details from DB
**********************************************************************************************/
const DeleteAgentInfo = async(req, res) => {
    try {
        await AgentModel.destroy({
            where: { id: req.params.id }
        })
        .th(record => {
            if(record === 1){
                res.json({ 
                    status: 'Success',
                    message: 'Record deleted Successfully..'
                })
            }else{
                res.json({ 
                    status: 'Failed',
                    message: 'Recode not found..'
                })
            }
        })
    } catch (error) {
        res.json({
            status: 'Failed',
            message: error
        });
    }
};

module.exports = {
    AddNewAgent,
    GetAllAgents,
    GetAllAgentsBySupervisorEmail,
    GetAllAgentsByDistrict,
    GetAllAgentsByTerritory,
    GetAgentByID,
    EditAgentInfo,
    UploadAgentProfilePic,
    DeleteAgentInfo
}