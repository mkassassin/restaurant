var CryptoJS = require("crypto-js");
var UserManagementModel = require('./../models/UserManagement.model');
var ErrorManagement = require('./../../handling/ErrorHandling');
var mongoose = require('mongoose');
var crypto = require("crypto");


exports.User_Create = function(req, res) {

   // var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   // var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   var ReceivingData = req.body;

   if(!ReceivingData.User_Name || ReceivingData.User_Name === '' ) {
      res.status(400).send({Status: false, Message: "User Name can not be empty" });
   } else if(!ReceivingData.User_Password || ReceivingData.User_Password === '' ) {
      res.status(400).send({Status: false, Message: "User Password can not be empty" });
   } else if(!ReceivingData.User_Type || ReceivingData.User_Type === '' ) {
      res.status(400).send({Status: false, Message: "User Type can not be empty " });
   } else {

      var Create_NewUser = new UserManagementModel.User_Management({
         Full_Name: ReceivingData.Full_Name || '',
         User_Name : ReceivingData.User_Name,
         User_Password : CryptoJS.SHA256(ReceivingData.User_Password),
         Phone : ReceivingData.Phone || '',
         Email : ReceivingData.Email || '',
         Address: ReceivingData.Address || '',
         Land_Mark: ReceivingData.Land_Mark || '',
         City: ReceivingData.City || '',
         State: ReceivingData.State || '',
         ZipCode: ReceivingData.ZipCode || '',
         User_Type: 'Admin',
         Created_By : null,
         Last_ModifiedBy : null,
         Active_Status :true,
      });
      Create_NewUser.save(function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Creation Query Error', 'UserManagement.controller', err);
            res.status(400).send({Status: false, Message: "Some error occurred while creating the User!."});
         } else {
            UserManagementModel.User_Management.findOne({'_id': result._id },
               { User_Password: 0, Created_By: 0, Last_ModifiedBy: 0, Active_Status: 0, LoginToken: 0, LoginTime: 0, LastActiveTime: 0, LogOutTime: 0 }, {})
            .exec (function(err_1, result_1) {
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Details Find Query Error', 'UserManagement.controller', err_1);
                     res.status(417).send({status: false, Message: "Some error occurred while Find User Details!."});
                  } else {
                     // var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_1), 'SecretKeyOut@123');
                     //    ReturnData = ReturnData.toString();
                     res.status(200).send({Status: true, Response: result_1 });
                  }
               });
         }
      });
   }
};

exports.User_Login_Validate = function(req, res) {
   // var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   // var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   var ReceivingData = req.body;

   if(!ReceivingData.User_Name || ReceivingData.User_Name === '' ) {
      res.status(400).send({Status: false, Message: "User_Name can not be empty" });
   } else if (!ReceivingData.User_Password || ReceivingData.User_Password === ''  ) {
      res.status(400).send({Status: false, Message: "User Password can not be empty" });
   } else {
      UserManagementModel.User_Management.findOne(
         {'User_Name': { $regex : new RegExp("^" + ReceivingData.User_Name + "$", "i") }, 'User_Password': CryptoJS.SHA256(ReceivingData.User_Password), 'Active_Status': true},
         { User_Password: 0, Created_By: 0, Last_ModifiedBy: 0, Active_Status: 0, LoginToken: 0, LoginTime: 0, LastActiveTime: 0, LogOutTime: 0 }, {})
      .exec(function(err, result) { 
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Details Validate Query Error', 'UserManagement.controller', err);
            res.status(417).send({status: false, Error:err, Message: "Some error occurred while Validate The User Details!."});
         } else {
            if(result === null){
               UserManagementModel.User_Management.findOne({'User_Name': { $regex : new RegExp("^" + ReceivingData.User_Name + "$", "i") } }, function(err_1, result_1) {
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Name Validate Query Error', 'UserManagement.controller', err_1);
                     res.status(417).send({Status: false, Error:err_1, Message: "Some error occurred while Validate the User Name!"});           
                  } else {
                     if (result_1 === null) {
                        res.status(200).send({ Status: false, Message: "Invalid account details!" });
                     }else{
                        res.status(200).send({ Status: false, Message: "User Name and password do not match!" });
                     }
                  }
               });
            }else{
               const Key = crypto.randomBytes(16).toString("hex");
               // var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), Key);
               // ReturnData = ReturnData.toString();
               // const NewReturnData = (ReturnData + Key).concat('==');
               UserManagementModel.User_Management.update(
                  { _id : result._id },
                  { $set: { LoginToken : Key, LoginTime: new Date().toString(), LastActiveTime: new Date() }}
               ).exec((err_3, result_3) => {
                  if(err_3) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User login Update Query Error', 'UserManagement.controller', err_3);
                     res.status(417).send({Status: false, Message: "Some error occurred while Update User Login Details!"});           
                  } else {
                     res.status(200).send({ Status: true,  Response: result });
                  }
               });
            }
         }
      });
   }
};



exports.Password_Change = function(req, res) {

   // var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   // var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   var ReceivingData = req.body;

   if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if(!ReceivingData.Old_Password || ReceivingData.Old_Password === '' ) {
      res.status(400).send({Status: false, Message: " Old Password can not be empty" });
   }else if(!ReceivingData.New_Password || ReceivingData.New_Password === '' ) {
      res.status(400).send({Status: false, Message: " New Password can not be empty" });
   }else{
      UserManagementModel.User_Management.findOne({'_id': ReceivingData.User_Id, 'User_Password': CryptoJS.SHA256(ReceivingData.Old_Password) }, function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Password Change User find Query Error', 'UserManagement.controller', err);
            res.status(417).send({ Status: false, Message: "Some error occurred while Find The User Details!." });
         } else {
            if (result !== null) {
               result.User_Password = CryptoJS.SHA256(ReceivingData.New_Password);
               result.save(function(err_1, result_1) {
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Password Update Query Error', 'UserManagement.controller', err_1);
                     res.status(417).send({Status: false, Message: "Some error occurred while Update the Password!"});           
                  } else {
                     res.status(200).send({ Status: true, Message: 'New Password Successfully Updated' });
                  }
               });
            }else {
               res.status(200).send({ Status: false, Message: 'Old Password is Invalid!' });
            }
         }
      });
   }
};





exports.Address_Update = function(req, res) {

   // var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   // var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

   var ReceivingData = req.body;

   if(!ReceivingData.User_Id || ReceivingData.User_Id === '' ) {
      res.status(400).send({Status: false, Message: "User Details can not be empty" });
   }else if(!ReceivingData.Full_Name || ReceivingData.Full_Name === '' ) {
      res.status(400).send({Status: false, Message: "Full Name can not be empty" });
   }else if(!ReceivingData.Address || ReceivingData.Address === '' ) {
      res.status(400).send({Status: false, Message: "Address can not be empty" });
   }else if(!ReceivingData.Land_Mark || ReceivingData.Land_Mark === '' ) {
      res.status(400).send({Status: false, Message: "Land Mark can not be empty" });
   }else if(!ReceivingData.City || ReceivingData.City === '' ) {
      res.status(400).send({Status: false, Message: "City can not be empty" });
   }else if(!ReceivingData.State || ReceivingData.State === '' ) {
      res.status(400).send({Status: false, Message: "State can not be empty" });
   }else if(!ReceivingData.ZipCode || ReceivingData.ZipCode === '' ) {
      res.status(400).send({Status: false, Message: "ZipCode can not be empty" });
   }else{
      UserManagementModel.User_Management.findOne({'_id': ReceivingData.User_Id }, function(err, result) {
         if(err) {
            ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'User Details find Query Error', 'UserManagement.controller', err);
            res.status(417).send({ Status: false, Message: "Some error occurred while Find The User Details!." });
         } else {
            if (result !== null) {
               result.Full_Name = ReceivingData.Full_Name;
               result.Address = ReceivingData.Address;
               result.Land_Mark = ReceivingData.Land_Mark;
               result.City = ReceivingData.City;
               result.State = ReceivingData.State;
               result.ZipCode = ReceivingData.ZipCode;
               result.save(function(err_1, result_1) {
                  if(err_1) {
                     ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Address Details Update Query Error', 'UserManagement.controller', err_1);
                     res.status(417).send({Status: false, Message: "Some error occurred while Update the Address Details!"});           
                  } else {
                     result_1 = JSON.parse(JSON.stringify(result_1));
                     delete result_1.User_Password;
                     delete result_1.Created_By;
                     delete result_1.Last_ModifiedBy;
                     delete result_1.LoginToken;
                     delete result_1.LoginTime;
                     delete result_1.LastActiveTime;
                     delete result_1.LogOutTime;
                     res.status(200).send({ Status: true, Response: result_1 });
                  }
               });
            }else {
               res.status(200).send({ Status: false, Message: 'User Details is Invalid!' });
            }
         }
      });
   }
};