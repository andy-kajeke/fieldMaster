const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const salt = genSaltSync(10);
const SupervisorModel = require('../models/supervisorDetails.model');

/*********************************************************************************************
 * Register new supervisor details to DB
**********************************************************************************************/
const AddNewSupervisor = async(req, res) => {
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
    var password = req.body.supervisorPhoneNumber;
    var supervisorPassword = password.slice(-5);

    const supervisorData = {
        id: uuidv4(),
        supervisorId: req.body.supervisorId,
        supervisorName: req.body.supervisorName,
        supervisorPhoneNumber: req.body.supervisorPhoneNumber,
        supervisorEmail: req.body.supervisorEmail,
        supervisorPhoto: process.env.IMAGE_URL + '/profile_photo/holder.png',
        password: hashSync(supervisorPassword, salt),
        resetCode: '',
        created_at: today,
        updated_at: today + ' ' + currentTime
    }

    try {
        await SupervisorModel.findOne({
            where: { supervisorEmail: req.body.supervisorEmail}
        })
        .then(isSupervisor => {
            if(!isSupervisor){
                SupervisorModel.create(supervisorData)
                .then(supervisor => {
                    res.json({
                        status: 'Success',
                        message: supervisor.supervisorName + ' has been registered successfully...'
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
                    message: 'Email already exists'
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
 * Get all registered supervisors from DB
**********************************************************************************************/
const GetAllSupervisors = async(req, res) => {
    try {
        await SupervisorModel.findAll()
        .then(supervisors => {
            res.json({supervisors});
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
 * Get registered supervisor details from DB by supervisorId
**********************************************************************************************/
const GetSupervisorByID = async(req, res) => {
    try {
        await SupervisorModel.findOne({
            where: { supervisorId: req.params.supervisorId }
        })
        .then(supervisor => {
            res.json({ supervisor });
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
const EditSupervisorInfo = async(req, res) => {
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

    const supervisorData = {
        supervisorId: req.body.supervisorId,
        supervisorName: req.body.supervisorName,
        supervisorPhoneNumber: req.body.supervisorPhoneNumber,
        supervisorEmail: req.body.supervisorEmail,
        updated_at: today + ' ' + currentTime
    }

    try {
        await SupervisorModel.findOne({
            where: { supervisorId: req.params.supervisorId }
        })
        .then(supervisor => {
            if(supervisor){
                AgentModel.update(supervisorData, {
                    where: { supervisorId: req.params.supervisorId }
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
 * Upload supervisor profile pic
**********************************************************************************************/
const UploadSupervisorProfilePic = async(req, res) => {
    SupervisorModel.update({
        supervisorPhoto: process.env.IMAGE_URL + '/profile_photo/' + req.file.originalname,
    },{
        where:{
            id: req.params.id
        }
    }).then(items => {
        res.json({ message: 'Photo uploaded successfully' });
    });
};

/*********************************************************************************************
 * Delete or remove registered supervisor details from DB
**********************************************************************************************/
const DeleteSupervisorInfo = async(req, res) => {
    try {
        await SupervisorModel.destroy({
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
    AddNewSupervisor,
    GetAllSupervisors,
    GetSupervisorByID,
    EditSupervisorInfo,
    UploadSupervisorProfilePic,
    DeleteSupervisorInfo
}
