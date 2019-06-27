var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
// var path = require('path');

var ErrorManagement = require('./server/handling/ErrorHandling.js');

var port = process.env.PORT || 3000;
var app = express();


// Process On Every Error
   process.setMaxListeners(0);
   process.on('unhandledRejection', (reason, promise) => {
      console.log(reason);
      ErrorManagement.ErrorHandling.ErrorLogCreation('', '', '', reason);
      // console.error("'Un Handled Rejection' Error Log File - " + new Date().toLocaleDateString());
   });
   process.on('uncaughtException', function (err) {
      console.log(err);
      ErrorManagement.ErrorHandling.ErrorLogCreation('', '', '', err.toString());
      // console.error(" 'Un Caught Exception' Error Log File - " + new Date().toLocaleDateString());
   });


// DB Connection
   mongoose.connect('mongodb://localhost:27017/Restaurant', { useNewUrlParser: true, useCreateIndex: true });
   mongoose.connection.on('error', function(err) {
      ErrorManagement.ErrorHandling.ErrorLogCreation('', 'Mongodb Connection Error', 'Server.js', err);
   });
   mongoose.connection.once('open', function() {
      console.log('DB Connectivity, Success!');
   });


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/API/Uploads', express.static('Uploads'));


require('./server/web/routes/UserManagement.routes')(app);
require('./server/web/routes/FoodItemsManagement.routes')(app);




//    app.use(express.static(__dirname + '/view/dist/view/'));

//    app.use(function(req, res) {
//       res.sendFile(path.join(__dirname, '/view/dist/view', 'index.html'));
//    });


app.get('*', function(req, res){
    res.send('This is Server Side Page');
});


app.listen(port, function(){
  console.log('Listening on port ' + port);
});