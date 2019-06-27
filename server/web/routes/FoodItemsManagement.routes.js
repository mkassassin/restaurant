module.exports = function(app) {

    var Controller = require('../Controllers/FoodItemsManagement.controller');
 
    app.post('/API/UserManagement/FoodItem_Create', Controller.FoodItem_Create);
    app.post('/API/UserManagement/FoodItem_Update', Controller.FoodItem_Update);
    app.post('/API/UserManagement/FoodItems_List', Controller.FoodItems_List);

    
 };
 