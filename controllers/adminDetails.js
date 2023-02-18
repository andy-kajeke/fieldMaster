const { genSaltSync, hashSync, compareSync } = require('bcryptjs');
const salt = genSaltSync(10);
const AdminModel = require('../models/admin.model');

/*********************************************************************************************
 * Register new admin details to DB
**********************************************************************************************/
const AddNewAdmin = async(req, res) => {
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

    const adminData = {
        id: uuidv4(),
        username: req.body.username,
        email: req.body.email,
        password: hashSync(req.body.password, salt),
        resetCode: '',
        created_at: today,
        updated_at: today + ' ' + currentTime
    };
    try {
        await AdminModel.findOne({
            where: { email: req.body.email }
        })
        .then(user => {
            if (!user) {
                AdminModel.create(adminData)
                .then(user => {
                    res.json({
                        status: `Success`,
                        message: user.username + ` has been registered successfully...`
                    });
                })
            } else {
                res.json({
                    status: `Failed`,
                    message: `Email already exists`
                });
            }
        })
    } catch (error) {
        
    }
};

module.exports = {
    AddNewAdmin
}