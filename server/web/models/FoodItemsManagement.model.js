var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var FoodItemsManagementSchema = mongoose.Schema({
   Title: { type : String, required : true },
   Description: { type : String, required : true },
   Image: { type: Object },
   Price: { type : String  },
   Session: {
		BreakFast: [{
			Day: { type : String },
			Status: { type : Boolean },
		}],
		Lunch: [{
			Day: { type : String },
			Status: { type : Boolean },
		}],
		Dinner: [{
			Day: { type : String },
			Status: { type : Boolean },
		}],
		Party: [{
			Day: { type : String },
			Status: { type : Boolean },
		}]
   },
   Quantity : { type : String },
   Type: {
		Veg: { type : Boolean },
		NonVeg: { type : Boolean },
		Vegan: { type : Boolean },
	},
	Cuisine: { type : String },
	PickupStatus: { type : Boolean },
	AvailablePeriod: {
		From: { type: Date },
		To: { type: Date }
	},
	PreparationTime: {
		Hours: { type: Number },
		Minutes: { type: Number }
	},
	ApproveStatus: { type: String }, // Approved, Pending, Rejected
   Created_By: { type: Schema.Types.ObjectId, ref: 'User_Management' },
   Last_ModifiedBy: { type: Schema.Types.ObjectId, ref: 'User_Management' },
	Active_Status: { type : Boolean, required : true },
	If_Deleted: { type : Boolean, required : true },
   },
   { timestamps: true }
);


var VarFoodItems_Management = mongoose.model('FoodItems_Management', FoodItemsManagementSchema, 'FoodItems_Management');

module.exports = {
    FoodItems_Management : VarFoodItems_Management   
};