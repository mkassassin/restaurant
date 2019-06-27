var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserManagementSchema = mongoose.Schema({
   Full_Name: { type : String },
   User_Name: { type : String , unique: true, required : true },
   User_Password: { type : String, required : true,  },
   Phone : { type : String },
   Email: { type : String },
   Address: { type : String },
   Land_Mark: { type : String },
   City: { type : String },
   State: { type : String },
   ZipCode: { type: String },
   User_Type: { type : String , required : true },
   Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management' },
   Last_ModifiedBy: { type: Schema.Types.ObjectId, ref: 'User_Management' },
   Active_Status: { type : Boolean, required : true },
   LoginToken: { type : String },
   LoginTime: { type : Date },
   LastActiveTime: { type : Date },
   LogOutTime: { type : Date },
   },
   { timestamps: true }
);

var UserLoginSchema = mongoose.Schema({
   Request_Ip: { type : String , required : true },
   Request_Origin: { type : String , required : true},
   Request_From: { type : String , required : true},
   Request_DeviceInfo: { type : Object , required : true },
   If_Logged_Out: { type : Boolean},
   User_Id: { type: Schema.Types.ObjectId, ref: 'User_Management' },
   Company_Id: { type: Schema.Types.ObjectId, ref: 'Company_Management' },
   Active_Status: { type : Boolean, required : true },
   },
   { timestamps: true }
);



var VarUser_Management = mongoose.model('User_Management', UserManagementSchema, 'User_Management');
var VarUserLogin_Management = mongoose.model('UserLogin_Management', UserLoginSchema, 'UserLogin_Management');


module.exports = {
   User_Management : VarUser_Management,
   UserLogin_Management : VarUserLogin_Management,
   
};