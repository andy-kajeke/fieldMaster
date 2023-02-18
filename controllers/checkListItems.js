const CheckListItemsModel = require('../models/checkListItems.model');
const AgentModel = require('../models/agentDetails.model');
const SupervisonModel = require('../models/supervisionDetails.model');
const SupervisonExeciseModel = require('../models/supervisonExecises.model');

/*********************************************************************************************
 * Register new check list item details to DB
**********************************************************************************************/
const AddNewCheckListItem = async(req, res) => {
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

    const itemData = {
        id: uuidv4(),
        itemName: req.body.itemName,
        created_at: today,
        updated_at: today + ' ' + currentTime
    };
    try {
        await CheckListItemsModel.findOne({
            where: { itemName: req.body.itemName }
        })
        .then(item => {
            if (!item) {
                CheckListItemsModel.create(itemData)
                .then(item => {
                    AgentModel.findAll()
                    .then(agents => {
                        if(agents.length != 0){
                            let count = 0;

                            agents.forEach(element => {
                                const { v4: uuidv4 } = require('uuid');
                                count++;

                                const supervisionData = {
                                    id: uuidv4(),
                                    agentId: element.agentId,
                                    agentName: element.agentName,
                                    agentPhoneNumber: element.agentPhoneNumber,
                                    agentRegion: element.agentRegion,
                                    agentHandlerName: element.agentHandlerName,
                                    agentHandlerPhoneNumber: element.agentHandlerPhoneNumber,
                                    agentHandlerEmail: element.agentHandlerEmail,
                                    agentDistrict: element.agentDistrict,
                                    agentTerritory: element.agentTerritory,
                                    agentTerritoryLatitude: element.agentTerritoryLatitude,
                                    agentTerritoryLongitude: element.agentTerritoryLongitude,
                                    agentPhoto: element.agentPhoto,
                                    handlerCurrentLatitude: '0.0',
                                    handlerCurrentLongitude: '0.0',
                                    checkListItemId: item.id,
                                    checkListItemName: req.body.itemName,
                                    checkListItemStatus: false,
                                    supervisionStatus: 'Pending',
                                    month: monthNames[date.getMonth()],
                                    year: date.getFullYear(),
                                    created_at: today,
                                    updated_at: today + ' ' + currentTime
                                }

                                SupervisonModel.create(supervisionData)
                            });

                            if(count === agents.length){
                                res.json({
                                    status: `Success`,
                                    message: item.itemName + ` has been registered successfully...`
                                });
                            }
                        }else{
                            res.json({
                                status: `Success`,
                                message: item.itemName + ` has been registered successfully...`
                            });
                        }

                    })
                    
                })
            } else {
                res.json({
                    status: `Failed`,
                    message: `Item already exists`
                });
            }
        })
    } catch (error) {
        res.json({
            status: 'Failed',
            message: error
        });
    }
};

/*********************************************************************************************
 * Get all check list items from DB
**********************************************************************************************/
const GetAllCheckListItems = async(req, res) => {
    try {
        await CheckListItemsModel.findAll()
        .then(items => {
            res.json({items});
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
 * Get all supervison monthly details of specific from DB
**********************************************************************************************/
const GetAllSupervisonDetailsOfAgent = async(req, res) => {
    try {
        await SupervisonModel.findAll({
            where: {
                agentId: req.params.agentId,
                //month: req.params.month,
                //year: req.params.year
            }
        })
        .then(supervisonData => {
            res.json({supervisonData});
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
 * Get all supervison annual details of specific from DB
**********************************************************************************************/
const GetAllAnnualSupervisonDetailsOfAgent = async(req, res) => {
    try {
        await SupervisonModel.findAll({
            where: {
                agentId: req.params.agentId,
                year: req.params.year
            }
        })
        .then(supervisonData => {
            res.json({supervisonData});
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
 * Get all supervison monthly details from DB
**********************************************************************************************/
const GetAllMonthlySupervisonDetails = async(req, res) => {
    try {
        await SupervisonModel.findAll({
            where: {
                month: req.params.month,
                year: req.params.year
            }
        })
        .then(supervisonData => {
            res.json({supervisonData});
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
 * Get all supervison annual details from DB
**********************************************************************************************/
const GetAllAnnualSupervisonDetails = async(req, res) => {
    try {
        await SupervisonModel.findAll({
            where: {
                year: req.params.year
            }
        })
        .then(supervisonData => {
            res.json({supervisonData});
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
 * Update check list details in DB
**********************************************************************************************/
const EditCheckListItem = async(req, res) => {
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
        await CheckListItemsModel.findOne({
            where: { id: res.params.id }
        })
        .then(item => {
            if(item){
                CheckListItemsModel.update({
                    itemName: req.body.itemName,
                    updated_at: today + ' ' + currentTime
                }, {
                    where: { id: res.params.id }
                })
                .then(() => {
                    SupervisonModel.findAll({
                        where: { checkListItemId: res.params.id }
                    })
                    .then(records => {
                        if(records.length != 0){
                            let count = 0;

                            records.forEach(() => {
                                count++;

                                const supervisionData = {
                                    checkListItemName: req.body.itemName,
                                    updated_at: today + ' ' + currentTime
                                }

                                SupervisonModel.update(supervisionData, {
                                    where: { checkListItemId: res.params.id }
                                })
                            });

                            if(count === records.length){
                                res.json({
                                    status: `Success`,
                                    message: `Record updated successfully...`
                                });
                            }
                        }else{
                            res.json({
                                status: `Success`,
                                message: `Record updated successfully...`
                            });
                        }

                    })
                })
                
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
 * Update supervison list details in DB
**********************************************************************************************/
const EditSupervisonList = async(req, res) => {
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
        await SupervisonModel.findAll({
            where: { agentId: req.params.agentId }
        })
        .then(records => {
            let itemUpdates = req.body.agentItems;
            let count = 0;
            //res.json({agent_ata: records , item_data : itemUpdates})

            records.forEach(element_1 => {
                itemUpdates.forEach(element_2 => {

                    if(element_1.checkListItemId === element_2.checkListItemId){
                        count++;
                        const itemData = {
                            checkListItemStatus: element_2.checkListItemStatus,
                            supervisionStatus: 'Checked',
                            updated_at: today + ' ' + currentTime
                        }

                        //console.log("checked === ", itemData);

                        SupervisonModel.update(itemData, {
                            where: { 
                                agentId: req.params.agentId,
                                checkListItemId: element_2.checkListItemId
                            }
                        })
                        .then(() => {})
                    }
                    else{}

                })
            });
            //console.log("count === ", count);

            if(count === itemUpdates.length){
                AgentModel.findOne({
                    where: {
                        agentId: req.params.agentId
                    }
                })
                .then(agent => {
                    SupervisonExeciseModel.findOne({
                        where: {
                            agentId: agent.agentId,
                            month: monthNames[date.getMonth()],
                            year: date.getFullYear()
                        }
                    })
                    .then(record => {
                        if(!record){
                            const { v4: uuidv4 } = require('uuid');
                            
                            const execiseData = {
                                id: uuidv4(),
                                agentId: agent.agentId,
                                agentName: agent.agentName,
                                agentPhoneNumber: agent.agentPhoneNumber,
                                agentHandlerName: agent.agentHandlerName,
                                agentHandlerPhoneNumber: agent.agentHandlerPhoneNumber,
                                agentDistrict: agent.agentDistrict,
                                agentTerritory: agent.agentTerritory,
                                supervisionLocation: req.body.supervisionLocation,
                                supervisionStatus: 'Supervised',
                                supervisionStatusColor: 'bg-success',
                                month: monthNames[date.getMonth()],
                                year: date.getFullYear(),
                                created_at: today,
                                updated_at: today + ' ' + currentTime
                            }

                            SupervisonExeciseModel.create(execiseData)
                            .then(() => {
                                res.json({
                                    status: `Success`,
                                    message: `Record has been updated successfully...`
                                })
                            })
                            .catch (error => {
                                res.json({
                                    status: 'Failed',
                                    message: error
                                });

                                console.log('error == ', error)
                            });
                        }
                        else{
                            SupervisonExeciseModel.update({
                                supervisionLocation: req.body.supervisionLocation,
                                updated_at: today + ' ' + currentTime
                            }, {
                                where: { 
                                    agentId: agent.agentId,
                                    month: monthNames[date.getMonth()],
                                    year: date.getFullYear()
                                }
                            })
                            .then(() => {
                                res.json({
                                    status: `Success`,
                                    message: `Record has been updated successfully...`
                                })
                            })
                            .catch (error => {
                                res.json({
                                    status: 'Failed',
                                    message: error
                                });

                                console.log('error == ', error)
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
 * Delete or remove registered agent details from DB
**********************************************************************************************/
const DeleteCheckListItemInfo = async(req, res) => {
    try {
        await CheckListItemsModel.destroy({
            where: { id: req.params.id }
        })
        .th(record => {
            if(record === 1){
                SupervisonModel.findAll({
                    where: { checkListItemId: res.params.id }
                })
                .then(records => {
                    if(records.length != 0){
                        let count = 0;

                        records.forEach(() => {
                            count++;

                            SupervisonModel.destroy({
                                where: { checkListItemId: res.params.id }
                            })
                        });

                        if(count === records.length){
                            res.json({
                                status: `Success`,
                                message: `Record deleted Successfully..`
                            });
                        }
                    }else{
                        res.json({
                            status: `Success`,
                            message: `Record deleted Successfully..`
                        });
                    }

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
    AddNewCheckListItem,
    GetAllCheckListItems,
    GetAllSupervisonDetailsOfAgent,
    GetAllAnnualSupervisonDetailsOfAgent,
    GetAllMonthlySupervisonDetails,
    GetAllAnnualSupervisonDetails,
    EditCheckListItem,
    EditSupervisonList,
    DeleteCheckListItemInfo
}