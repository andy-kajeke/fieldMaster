const jwt = require('jsonwebtoken');
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const salt = genSaltSync(10);
const randomize = require('randomatic');
const AdminModel = require('../models/admin.model');
const AgentModel = require('../models/agentDetails.model');
const SupervisorModel = require('../models/supervisorDetails.model');

/*********************************************************************************************
 * Login registered users
**********************************************************************************************/
const Login = async(req, res) => {
    var userType = req.params.userType;

    try {
        if(userType === 'admin' || userType === 'Admin' || userType === 'ADMIN'){
            await AdminModel.findOne({
                where: { email: req.body.email }
            })
            .then(admin => {
                if (admin) {
                    if (compareSync(req.body.password, admin.password)) {
                        let token = jwt.sign(admin.dataValues, process.env.SECURITY_KEY, {
                            expiresIn: "2h"
                        });
                        res.send(token);
                    } else {
                        res.json({
                            is_user: false,
                            message: 'Password is incorrect'
                        });
                    }
                } 
                else {
                    res.json({
                        is_user: false,
                        message: `User doesn't exist`
                    });
                }
            });
        }
        else if(userType === 'supervisor' || userType === 'Supervisor' || userType === 'SUPERVISOR' || userType === 'supervisor' || userType === 'Supervisor' || userType === 'SUPERVISOR' || userType === 'supervisor' || userType === 'Supervisor' || userType === 'SUPERVISOR'){
            await SupervisorModel.findOne({
                where: { supervisorEmail: req.body.supervisorEmail }
            })
            .then(supervisor => {
                if (supervisor) {
                    if (compareSync(req.body.password, supervisor.password)) {
                        let token = jwt.sign(supervisor.dataValues, process.env.SECURITY_KEY, {
                            expiresIn: "2h"
                        });
                        //res.send(token);
                        res.json({
                            is_user: true,
                            id: supervisor.id,
                            supervisorId: supervisor.supervisorId,
                            supervisorName: supervisor.supervisorName,
                            supervisorPhoneNumber: supervisor.supervisorPhoneNumber,
                            supervisorEmail: supervisor.supervisorEmail,
                            access_token: token
                        })
                    } else {
                        res.json({
                            is_user: false,
                            message: 'Password is incorrect'
                        });
                    }
                } 
                else {
                    res.json({
                        is_user: false,
                        message: `User doesn't exist`
                    });
                }
            });
        }
        else if(userType === 'agent' || userType === 'Agent' || userType === 'AGENT' || userType === 'agent' || userType === 'Agent' || userType === 'AGENT' || userType === 'agent' || userType === 'Agent' || userType === 'AGENT'){
            await AgentModel.findOne({
                where: { agentPhoneNumber: req.body.agentPhoneNumber }
            })
            .then(agent => {
                if (agent) {
                    if (compareSync(req.body.password, agent.password)) {
                        let token = jwt.sign(agent.dataValues, process.env.SECURITY_KEY, {
                            expiresIn: "2h"
                        });
                        //res.send(token);
                        res.json({
                            is_user: true,
                            id: agent.id,
                            agentId: agent.agentId,
                            agentName: agent.agentName,
                            agentPhoneNumber: agent.agentPhoneNumber,
                            access_token: token
                        })
                    } else {
                        res.json({
                            is_user: false,
                            message: 'Password is incorrect'
                        });
                    }
                } 
                else {
                    res.json({
                        is_user: false,
                        message: `User doesn't exist`
                    });
                }
            });
        }
        else{
            res.json({
                is_user: false,
                message: `User type doesn't exist`
            });
        }
    } catch (error) {
        res.json({
            status: `Failed`,
            message: error
        });
    }
};

/*********************************************************************************************
 * Change password for registered users
**********************************************************************************************/
const ChangePassword = async(req, res) => {
    var userType = req.params.userType;
    var old_password = req.body.old_password;
    var new_password = req.body.new_password;

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
        if(userType === 'admin' || userType === 'Admin' || userType === 'ADMIN'){
            await AdminModel.findOne({
                where: { email: req.body.email }
            })
            .then(admin => {
                if (admin) {
                    if (compareSync(old_password, admin.password)) {
                        AdminModel.update({
                            password: hashSync(new_password, salt),
                            updated_at: today + " " + currentTime
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                        .then(user => res.json({
                            message: 'Password changed successfully'
                        }));
                    } else {
                        res.json({
                            message: 'Current password is incorrect'
                        });
                    }
                } 
                else {
                    res.json({
                        is_user: false,
                        message: `User doesn't exist`
                    });
                }
            });
        }
        else if(userType === 'supervisor' || userType === 'Supervisor' || userType === 'SUPERVISOR'){
            await SupervisorModel.findOne({
                where: { supervisorEmail: req.body.supervisorEmail }
            })
            .then(supervisor => {
                if (supervisor) {
                    if (compareSync(old_password, supervisor.password)) {
                        SupervisorModel.update({
                            password: hashSync(new_password, salt),
                            updated_at: today + " " + currentTime
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                        .then(user => res.json({
                            message: 'Password changed successfully'
                        }));
                    } else {
                        res.json({
                            message: 'Current password is incorrect'
                        });
                    }
                } 
                else {
                    res.json({
                        is_user: false,
                        message: `User doesn't exist`
                    });
                }
            });
        }
        else if(userType === 'agent' || userType === 'Agent' || userType === 'AGENT'){
            await AgentModel.findOne({
                where: { agentPhoneNumber: req.body.agentPhoneNumber }
            })
            .then(agent => {
                if (agent) {
                    if (compareSync(old_password, agent.password)) {
                        AgentModel.update({
                            password: hashSync(new_password, salt),
                            updated_at: today + " " + currentTime
                        }, {
                            where: {
                                id: req.params.id
                            }
                        })
                        .then(user => res.json({
                            message: 'Password changed successfully'
                        }));
                    } else {
                        res.json({
                            message: 'Current password is incorrect'
                        });
                    }
                } 
                else {
                    res.json({
                        is_user: false,
                        message: `User doesn't exist`
                    });
                }
            });
        }
        else{
            res.json({
                is_user: false,
                message: `User type doesn't exist`
            });
        }
    } catch (error) {
        res.json({
            status: `Failed`,
            message: error
        });
    }
};

/*********************************************************************************************
 * Forgot password for registered users
**********************************************************************************************/
const ForgotPassword = async(req, res) => {
    var userType = req.params.userType;
    var vaildationCode = randomize('0', 5);

    try {
        if(userType === 'admin' || userType === 'Admin' || userType === 'ADMIN'){
            AdminModel.findOne({
                where: {
                    email: req.body.email
                }
            })
            .then(user => {
                if (user) {
                    //step 1
                    let transporter = nodemailer.createTransport({
                        host: 'rcksi.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORD
                        }
                    });
        
                    //step 2  
                    let mailOptions = {
                        from: process.env.EMAIL, 
                        to: user.email,
                        subject: 'Field Master Account Password',
                        text: 'Hello ' + user.username + ', \nYour request to reset password has been acknowledged by FIELD MASTER. \nUse this verification code'+
                        ' '+ vaildationCode + ' to reset password'
                    }
        
                    //step 3
                    transporter.sendMail(mailOptions, (err, data) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log('Email sent..!!');
        
                            AdminModel.update({
                                resetCode: vaildationCode
                            }, {
                                where: { email: req.body.email }
                            })
                            .then(() => {
                                res.json({
                                    status: `Success`,
                                    message: 'Email sent'
                                })
                            })
                        }
                    })
                }else{
                    res.json({
                        status: `Failed`,
                        message: `Email doesn't exit`
                    })
                }
            })
            .catch(err => {
                res.json({ 
                    status: `Failed`,
                    error: err 
                });
            });
        }
        else if(userType === 'supervisor' || userType === 'Supervisor' || userType === 'SUPERVISOR'){
            SupervisorModel.findOne({
                where: {
                    supervisorEmail: req.body.supervisorEmail
                }
            })
            .then(user => {
                if (user) {
                    //step 1
                    let transporter = nodemailer.createTransport({
                        host: 'rcksi.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: process.env.EMAIL,
                            pass: process.env.PASSWORD
                        }
                    });
        
                    //step 2  
                    let mailOptions = {
                        from: process.env.EMAIL, 
                        to: user.supervisorEmail,
                        subject: 'Field Master Account Password',
                        text: 'Hello ' + user.username + ', \nYour request to reset password has been acknowledged by FIELD MASTER. \nUse this verification code'+
                        ' '+ vaildationCode + ' to reset password'
                    }
        
                    //step 3
                    transporter.sendMail(mailOptions, (err, data) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log('Email sent..!!');
        
                            AdminModel.update({
                                resetCode: vaildationCode
                            }, {
                                where: { supervisorEmail: req.body.supervisorEmail }
                            })
                            .then(() => {
                                res.json({
                                    status: `Success`,
                                    message: 'Email sent'
                                })
                            })
                        }
                    })
                }else{
                    res.json({
                        status: `Failed`,
                        message: `Email doesn't exit`
                    })
                }
            })
            .catch(err => {
                res.json({ 
                    status: `Failed`,
                    error: err 
                });
            });
        }
        else if(userType === 'agent' || userType === 'Agent' || userType === 'AGENT'){

        }
        else{
            res.json({
                is_user: false,
                message: `User type doesn't exist`
            });
        }
    } catch (error) {
        res.json({
            status: `Failed`,
            message: error
        });
    }
};

/*********************************************************************************************
 * Reset password for registered users
**********************************************************************************************/
const ResetPassword = async(req, res) => {
    var userType = req.params.userType;
    var vaildationCode = req.body.vaildation_code;
    var new_password = hashSync(req.body.new_password, salt);

    try {
        if (userType === 'admin' || userType === 'Admin' || userType === 'ADMIN') {
            AdminModel.findOne({
                where: {
                    email: req.body.email,
                    resetCode: vaildationCode
                }
            })
            .then(user => {
                if (user) {
                    AdminModel.update({
                        password: new_password
                    },{
                        where: {email: req.body.email}
                    })
                    .then(() => {
                        res.json({
                            status: `Success`,
                            message: `Password has been reset successfully..`
                        });
                    })
                }else{
                    res.json({
                        status: `Failed`,
                        message: `Invalid verification code. Check your email and try again..`
                    });
                }
            })
            .catch(err => {
                res.json({ 
                    status: `Failed`,
                    error: err 
                });
            });
        } 
        else if(userType === 'supervisor' || userType === 'Supervisor' || userType === 'SUPERVISOR') {
            SupervisorModel.findOne({
                where: {
                    email: req.body.email,
                    resetCode: vaildationCode
                }
            })
            .then(user => {
                if (user) {
                    SupervisorModel.update({
                        password: new_password
                    },{
                        where: { supervisorEmail: req.body.supervisorEmail }
                    })
                    .then(() => {
                        res.json({
                            status: `Success`,
                            message: `Password has been reset successfully..`
                        });
                    })
                }else{
                    res.json({
                        status: `Failed`,
                        message: `Invalid verification code. Check your email and try again..`
                    });
                }
            })
            .catch(err => {
                res.json({ 
                    status: `Failed`,
                    error: err 
                });
            });
        }
        else if(userType === 'agent' || userType === 'Agent' || userType === 'AGENT'){

        }
        else{
            res.json({
                is_user: false,
                message: `User type doesn't exist`
            });
        }
    } catch (error) {
        res.json({
            status: `Failed`,
            message: error
        });
    }
};

module.exports = {
    Login,
    ChangePassword,
    ForgotPassword,
    ResetPassword
}

