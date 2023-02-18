const express = require('express');
const SystemRouter = express.Router();
const multer = require("multer");
const AuthenticationController = require('../controllers/authentication');
const AdminController = require('../controllers/adminDetails');
const AgentController = require('../controllers/agentDetails');
const SupervisorController = require('../controllers/supervisorDetails');
const CheckListItemController = require('../controllers/checkListItems');

/**Image uploads */
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./images/profile_pics");
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

/**System routes */
let routes = (app) => {

    /**Authentication routes */
    SystemRouter.post('/login/:userType', AuthenticationController.Login);
    SystemRouter.put('/change_password/:userType/:id', AuthenticationController.ChangePassword);
    SystemRouter.post('/forgot_password/:userType', AuthenticationController.ForgotPassword);
    SystemRouter.post('/reset_password/:userType', AuthenticationController.ResetPassword);

    /**Admin routes */
    SystemRouter.post('/admin/register', AdminController.AddNewAdmin);

    /**Agent routes */
    SystemRouter.post('/agent/register', AgentController.AddNewAgent);
    SystemRouter.get('/agents', AgentController.GetAllAgents);
    SystemRouter.get('/agent/:agentId', AgentController.GetAgentByID);
    SystemRouter.get('/agents/supervisor/:agentHandlerEmail', AgentController.GetAllAgentsBySupervisorEmail);
    SystemRouter.get('/agents/district/:agentDistrict', AgentController.GetAllAgentsByDistrict);
    SystemRouter.get('/agents/territory/:agentTerritory', AgentController.GetAllAgentsByTerritory);
    SystemRouter.put('/agent/update_info/:agentId', AgentController.EditAgentInfo);
    SystemRouter.put('/agent_photo/:id', upload.single('agentPhoto'), AgentController.UploadAgentProfilePic);
    SystemRouter.delete('/agent/delete_info/:id', AgentController.DeleteAgentInfo);

    /**Supervisor routes */
    SystemRouter.post('/supervisor/register', SupervisorController.AddNewSupervisor);
    SystemRouter.get('/supervisors', SupervisorController.GetAllSupervisors);
    SystemRouter.get('/supervisor/:supervisorId', SupervisorController.GetSupervisorByID);
    SystemRouter.put('/supervisor/update_info/:supervisorId', SupervisorController.EditSupervisorInfo);
    SystemRouter.put('/supervisor_photo/:id', upload.single('supervisorPhoto'), SupervisorController.UploadSupervisorProfilePic);
    SystemRouter.delete('/supervisor/delete_info/:id', SupervisorController.DeleteSupervisorInfo);

    /**Check list and Supervison routes */
    SystemRouter.post('/item/register', CheckListItemController.AddNewCheckListItem);
    SystemRouter.get('/items', CheckListItemController.GetAllCheckListItems);
    SystemRouter.get('/supervision/agent/monthly/:agentId', CheckListItemController.GetAllSupervisonDetailsOfAgent);
    SystemRouter.get('/supervision/agent/annual/:agentId/:year', CheckListItemController.GetAllAnnualSupervisonDetailsOfAgent);
    SystemRouter.get('/supervision/monthly/:month/:year', CheckListItemController.GetAllMonthlySupervisonDetails);
    SystemRouter.get('/supervision/annual/:year', CheckListItemController.GetAllAnnualSupervisonDetails);
    SystemRouter.put('/supervision/execise/:agentId', CheckListItemController.EditSupervisonList);
    SystemRouter.put('/item/update_info/:id', CheckListItemController.EditCheckListItem);
    SystemRouter.delete('/item/delete_info/:id', CheckListItemController.DeleteCheckListItemInfo);

    /**Handler routes */

    /**Base routes */
    app.use('/api', SystemRouter);
    app.use('/profile_photo', express.static('images/profile_pics/'));
    app.use('/outlet_photos', express.static('images/outlet_pics/'));
};

module.exports = routes;