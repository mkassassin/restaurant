var CryptoJS = require("crypto-js");
var FoodItemsManagementModel = require('./../models/FoodItemsManagement.model');
var ErrorManagement = require('./../../handling/ErrorHandling.js');
var mongoose = require('mongoose');
var multer = require('multer');

var Image_Storage = multer.diskStorage({
	destination: (req, file, cb) => { cb(null, './Uploads/FoodItems'); },
	filename: (req, file, cb) => { cb(null, 'Item_' + Date.now() + '.png'); }
});
var Image_Upload = multer({
	storage: Image_Storage,
	fileFilter: function (req, file, callback) {
		let extArray = file.originalname.split(".");
		let extension = (extArray[extArray.length - 1]).toLowerCase();
		if(extension !== 'png' && extension !== 'jpg' && extension !== 'gif' && extension !== 'jpeg') {
			return callback("Only 'png, gif, jpg and jpeg' images are allowed");
		}
		callback(null, true);
	}
}).single('FoodItem');


exports.FoodItem_Create = function(req, res) {
	Image_Upload(req, res, function(upload_err) {
      // var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
		// var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      var ReceivingData = req.body;

		if(!ReceivingData.Title || ReceivingData.Title === '' ) {
			res.status(400).send({Status: false, Message: "Title can not be empty" });
		}else if(!ReceivingData.Description || ReceivingData.Description === '' ) {
			res.status(400).send({Status: false, Message: "Description can not be empty" });
		}else if(!ReceivingData.Price || ReceivingData.Price === '' ) {
			res.status(400).send({Status: false, Message: "Price can not be empty" });
		}else if(!ReceivingData.Session || typeof ReceivingData.Session !== 'object' || ReceivingData.Session.length <= 0) {
			res.status(400).send({Status: false, Message: "Session Details can not be Proper" });
		}else if(ReceivingData.Quantity || ReceivingData.Quantity === '') {
			res.status(400).send({Status: false, Message: "Quantity can not be empty" });
		}else if(!ReceivingData.Type || typeof ReceivingData.Type !== 'object' || ReceivingData.Type.length <= 0) {
			res.status(400).send({Status: false, Message: "Food Item Type can not be Proper" });
		}else if(!ReceivingData.Cuisine || ReceivingData.Cuisine === '') {
			res.status(400).send({Status: false, Message: "Cuisine can not be empty" });
		}else if(ReceivingData.PickupStatus === null || ReceivingData.PickupStatus === '') {
			res.status(400).send({Status: false, Message: "PickupStatus can not be empty" });
		}else if(!ReceivingData.AvailablePeriod || typeof ReceivingData.AvailablePeriod !== 'object' || ReceivingData.AvailablePeriod.length <= 0) {
			res.status(400).send({Status: false, Message: "Available Period can not be Proper" });
		}else if(!ReceivingData.PreparationTime || typeof ReceivingData.PreparationTime !== 'object' || ReceivingData.PreparationTime.length <= 0) {
			res.status(400).send({Status: false, Message: "Preparation Time can not be Proper" });
		}else if(!ReceivingData.ApproveStatus || ReceivingData.ApproveStatus === '') {
			res.status(400).send({Status: false, Message: "Approve Status can not be empty" });
		}else if(req.file === undefined || req.file === null || req.file === '' || upload_err) {
			if (upload_err) {
				res.status(400).send({Status: false, Message: upload_err });
			} else {
				res.status(400).send({Status: false, Message: "Image can not be empty" });
			}
		} else if (!ReceivingData.Created_By || ReceivingData.Created_By === ''  ) {
			res.status(400).send({Status: false, Message: "Creator Details can not be empty" });
		}else {

			var _Image =  { filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size };

			var SessionTypes = ['BreakFast', 'BreakFast', 'Dinner', 'Party'];
			var FoodTypes = ['Veg', 'NonVeg', 'Vegan'];
			var AvailablePeriod = ['From', 'To'];
			var PreparationTime = ['Hours', 'Minutes'];

			var SessionValid = true;
			var FoodTypeValid = true;
			var AvailablePeriodValid = true;
			var PreparationTimeValid = true;

			SessionTypes.map(obj => {
				const SessionData = ReceivingData.Session[obj];
				if (!SessionData || typeof SessionData !== 'object' || SessionData.length < 8) {
					SessionValid = false;
				}
			});
			FoodTypes.map(obj => {
				const FoodTypeData = ReceivingData.Type[obj];
				if (!FoodTypeData || typeof FoodTypeData !== 'object' || FoodTypeData.length < 2) {
					FoodTypeValid = false;
				}
			});
			AvailablePeriod.map(obj => {
				const AvailablePeriodData = ReceivingData.AvailablePeriod[obj];
				if (!AvailablePeriodData || typeof AvailablePeriodData !== 'object' || AvailablePeriodData.length < 2) {
					AvailablePeriodValid = false;
				} else {
					ReceivingData.AvailablePeriod[obj] = new Date(ReceivingData.AvailablePeriod[obj]);
				}
			});
			PreparationTime.map(obj => {
				const PreparationTimeData = ReceivingData.PreparationTime[obj];
				if (!PreparationTimeData || typeof PreparationTimeData !== 'object' || PreparationTimeData.length < 2) {
					PreparationTimeValid = false;
				}
         });
         
			if (SessionValid && FoodTypeValid && AvailablePeriodValid && PreparationTimeValid) {

				if (ReceivingData.Created_By !== '' && ReceivingData.Created_By && ReceivingData.Created_By !== null) {
					ReceivingData.Created_By = mongoose.Types.ObjectId(ReceivingData.Created_By);
				} else {
					ReceivingData.Created_By = null;
            }
            
				const Create_FoodItem = new FoodItemsManagementModel.FoodItems_Management({
					Title: ReceivingData.Title,
					Description: ReceivingData.Description,
					Image: _Image,
					Price: ReceivingData.Price,
					Session: ReceivingData.Session, 
					Quantity: ReceivingData.Quantity,
					Type: ReceivingData.Type,
					Cuisine: ReceivingData.Cuisine,
					PickupStatus: ReceivingData.PickupStatus,
					AvailablePeriod: ReceivingData.AvailablePeriod,
					PreparationTime: ReceivingData.PreparationTime,
					ApproveStatus: ReceivingData.ApproveStatus,
					Created_By: ReceivingData.Created_By,
					Last_Modified_By: ReceivingData.Created_By,
					Active_Status: true,
					If_Deleted: false
            });
            
				Create_FoodItem.save(function(err, result) {
					if(err) {
						ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Food Item Create Query Error', 'FoodItemsManagement.controller');
						res.status(417).send({Status: false, Message: "Some error occurred while Creating the Food Item!."});
					} else {

						FoodItemsManagementModel.FoodItems_Management
						.findOne({'_id': mongoose.Types.ObjectId(result._id) }, {}, {})
						.populate({ path: 'Created_By', select: 'Name'})
						.populate({ path: 'Last_Modified_By', select: 'Name' })
						.exec(function(err, result) {
							if(err) {
								ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Created Food Item Find Query Error', 'FoodItemsManagement.controller', err);
								res.status(417).send({status: false, Message: "Some error occurred while Find The Food Created Item!."});
							} else {
								// var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
								// ReturnData = ReturnData.toString();
								res.status(200).send({Status: true, Response: result });
							}
                  });
               
					}
            });
            
			} else {
				if (!SessionValid) {
					res.status(400).send({Status: false, Message: "Session Details can not be Proper" });
				}
				if (!FoodTypeValid) {
					res.status(400).send({Status: false, Message: "Food Item Type can not be Proper" });
				}
				if (!AvailablePeriodValid) {
					res.status(400).send({Status: false, Message: "Available Period can not be Proper" });
				}
				if (!PreparationTimeValid) {
					res.status(400).send({Status: false, Message: "Preparation Time can not be Proper" });
				}
			}
		}
	});
};



exports.FoodItem_Update = function(req, res) {
   Image_Upload(req, res, function(upload_err) {

   // var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   // var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));

      var ReceivingData = req.body;

      if(!ReceivingData.FoodItem_Id || ReceivingData.FoodItem_Id === '' ) {
         res.status(400).send({Status: false, Message: "Food Item can not be Proper" });
      }else if(!ReceivingData.Title || ReceivingData.Title === '' ) {
         res.status(400).send({Status: false, Message: "Title can not be empty" });
      }else if(!ReceivingData.Description || ReceivingData.Description === '' ) {
         res.status(400).send({Status: false, Message: "Description can not be empty" });
      }else if(!ReceivingData.Price || ReceivingData.Price === '' ) {
         res.status(400).send({Status: false, Message: "Price can not be empty" });
      }else if(!ReceivingData.Session || typeof ReceivingData.Session !== 'object' || ReceivingData.Session.length <= 0) {
         res.status(400).send({Status: false, Message: "Session Details can not be Proper" });
      }else if(ReceivingData.Quantity || ReceivingData.Quantity === '') {
         res.status(400).send({Status: false, Message: "Quantity can not be empty" });
      }else if(!ReceivingData.Type || typeof ReceivingData.Type !== 'object' || ReceivingData.Type.length <= 0) {
         res.status(400).send({Status: false, Message: "Food Item Type can not be Proper" });
      }else if(!ReceivingData.Cuisine || ReceivingData.Cuisine === '') {
         res.status(400).send({Status: false, Message: "Cuisine can not be empty" });
      }else if(ReceivingData.PickupStatus === null || ReceivingData.PickupStatus === '') {
         res.status(400).send({Status: false, Message: "PickupStatus can not be empty" });
      }else if(!ReceivingData.AvailablePeriod || typeof ReceivingData.AvailablePeriod !== 'object' || ReceivingData.AvailablePeriod.length <= 0) {
         res.status(400).send({Status: false, Message: "Available Period can not be Proper" });
      }else if(!ReceivingData.PreparationTime || typeof ReceivingData.PreparationTime !== 'object' || ReceivingData.PreparationTime.length <= 0) {
         res.status(400).send({Status: false, Message: "Preparation Time can not be Proper" });
      }else if(!ReceivingData.ApproveStatus || ReceivingData.ApproveStatus === '') {
         res.status(400).send({Status: false, Message: "Approve Status can not be empty" });
      }else if((!ReceivingData.OldImage || ReceivingData.OldImage === '' || ReceivingData.OldImage === null) && (req.file === undefined || req.file === null || req.file === '' || upload_err)) {
         if (upload_err) {
            res.status(400).send({Status: false, Message: upload_err });
         } else {
            res.status(400).send({Status: false, Message: "Image can not be empty" });
         }
      } else if (!ReceivingData.Modified_By || ReceivingData.Modified_By === ''  ) {
         res.status(400).send({Status: false, Message: "Modified User Details can not be empty" });
      }else {

         var _Image = {};
         if (!ReceivingData.OldImage || ReceivingData.OldImage === '' || ReceivingData.OldImage === null) {
            _Image =  { filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size };
         } else {
            _Image = ReceivingData.OldImage;
         }

			var SessionTypes = ['BreakFast', 'BreakFast', 'Dinner', 'Party'];
			var FoodTypes = ['Veg', 'NonVeg', 'Vegan'];
			var AvailablePeriod = ['From', 'To'];
			var PreparationTime = ['Hours', 'Minutes'];

			var SessionValid = true;
			var FoodTypeValid = true;
			var AvailablePeriodValid = true;
			var PreparationTimeValid = true;

			SessionTypes.map(obj => {
				const SessionData = ReceivingData.Session[obj];
				if (!SessionData || typeof SessionData !== 'object' || SessionData.length < 8) {
					SessionValid = false;
				}
			});
			FoodTypes.map(obj => {
				const FoodTypeData = ReceivingData.Type[obj];
				if (!FoodTypeData || typeof FoodTypeData !== 'object' || FoodTypeData.length < 2) {
					FoodTypeValid = false;
				}
			});
			AvailablePeriod.map(obj => {
				const AvailablePeriodData = ReceivingData.AvailablePeriod[obj];
				if (!AvailablePeriodData || typeof AvailablePeriodData !== 'object' || AvailablePeriodData.length < 2) {
					AvailablePeriodValid = false;
				} else {
					ReceivingData.AvailablePeriod[obj] = new Date(ReceivingData.AvailablePeriod[obj]);
				}
			});
			PreparationTime.map(obj => {
				const PreparationTimeData = ReceivingData.PreparationTime[obj];
				if (!PreparationTimeData || typeof PreparationTimeData !== 'object' || PreparationTimeData.length < 2) {
					PreparationTimeValid = false;
				}
         });

         if (SessionValid && FoodTypeValid && AvailablePeriodValid && PreparationTimeValid) {

				if (ReceivingData.Modified_By !== '' && ReceivingData.Modified_By && ReceivingData.Modified_By !== null) {
					ReceivingData.Modified_By = mongoose.Types.ObjectId(ReceivingData.Modified_By);
				} else {
					ReceivingData.Modified_By = null;
            }

            FoodItemsManagementModel.FoodItems_Management.findOne({'_id': ReceivingData.FoodItem_Id}, {}, {}, function(err, result) {
               if(err) {
                  ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Food Item FindOne Query Error', 'FoodItemsManagement.controller', err);
                  res.status(417).send({status: false, Error:err, Message: "Some error occurred while Find The Food Item!."});
               } else {
                  if (result !== null) {
                     result.Title = ReceivingData.Title;
                     result.Description = ReceivingData.Description;
                     result.Image = _Image;
                     result.Price = ReceivingData.Price;
                     result.Session = ReceivingData.Session;
                     result.Quantity = ReceivingData.Quantity;
                     result.Type = ReceivingData.Type;
                     result.Cuisine = ReceivingData.Cuisine;
                     result.PickupStatus = ReceivingData.PickupStatus;
                     result.AvailablePeriod = ReceivingData.AvailablePeriod;
                     result.PreparationTime = ReceivingData.PreparationTime;
                     result.ApproveStatus = ReceivingData.ApproveStatus;
                     result.Last_Modified_By = ReceivingData.Modified_By;
                     result.save(function(err_1, result_1) {
                        if(err_1) {
                           ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Course Update Query Error', 'FoodItemsManagement.controller');
                           res.status(417).send({Status: false, Error: err_1, Message: "Some error occurred while Update the Food Item!."});
                        } else {
                           FoodItemsManagementModel.FoodItems_Management
                              .findOne({'_id': result_1._id})
                              .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
                              .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
                              .exec(function(err_2, result_2) {
                              if(err_2) {
                                 ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Configurations Course Find Query Error', 'FoodItemsManagement.controller', err_2);
                                 res.status(417).send({status: false, Message: "Some error occurred while Find The Food Item!."});
                              } else {
                                 // var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result_2), 'SecretKeyOut@123');
                                 // ReturnData = ReturnData.toString();
                                 res.status(200).send({Status: true, Response: result_2 });
                              }
                           });
                        }
                     });
                  } else {
                     res.status(400).send({Status: false, Message: "Food Item Details can not be valid!" });
                  }
               }
            });
         } else {
				if (!SessionValid) {
					res.status(400).send({Status: false, Message: "Session Details can not be Proper" });
				}
				if (!FoodTypeValid) {
					res.status(400).send({Status: false, Message: "Food Item Type can not be Proper" });
				}
				if (!AvailablePeriodValid) {
					res.status(400).send({Status: false, Message: "Available Period can not be Proper" });
				}
				if (!PreparationTimeValid) {
					res.status(400).send({Status: false, Message: "Preparation Time can not be Proper" });
				}
         }
      }
   });
};
 



exports.FoodItems_List = function(req, res) {
	// var CryptoBytes  = CryptoJS.AES.decrypt(req.body.Info, 'SecretKeyIn@123');
   // var ReceivingData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
   
   var ReceivingData = req.body;

	if (!ReceivingData.User_Id || ReceivingData.User_Id === ''  ) {
	   res.status(400).send({Status: false, Message: "User Details can not be empty" });
	} else {
		FoodItemsManagementModel.FoodItems_Management
         .find({'If_Deleted' : false}, {}, {sort: { updatedAt: -1 }})
         .populate({ path: 'Created_By', select: ['Name', 'User_Type'] })
         .populate({ path: 'Last_Modified_By', select: ['Name', 'User_Type'] })
         .exec(function(err, result) {
            if(err) {
               ErrorManagement.ErrorHandling.ErrorLogCreation(req, 'Food Items Find Query Error', 'FoodItemsManagement.controller', err);
               res.status(417).send({status: false, Message: "Some error occurred while Find The Food Items !."});
            } else {
               // var ReturnData = CryptoJS.AES.encrypt(JSON.stringify(result), 'SecretKeyOut@123');
               // ReturnData = ReturnData.toString();
               res.status(200).send({Status: true, Response: result });
            }
	   });
	}
};
