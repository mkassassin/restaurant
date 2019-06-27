module.exports = function(app) {

    var Controller = require('../Controllers/UserManagement.controller');
 
    app.post('/API/UserManagement/User_Login_Validate', Controller.User_Login_Validate);
    app.post('/API/UserManagement/Password_Change', Controller.Password_Change);
    app.post('/API/UserManagement/Address_Update', Controller.Address_Update);
 
 };
 