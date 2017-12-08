var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  config = require('./config/database'),

  bodyParser = require('body-parser');
  const cors = require('cors');

var cotationscript = require("./api/routes/checkcotation.js");
  
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
	if (err){
		console.log('could not connect to database : ', err);
	}else{
		console.log('connected to database: '+ config.db);
	}
}); 

app.use(cors(/*{ origin: 'http://localhost:4200' }*/));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//var userroutes = require('./api/routes/UserRoutes');
//var inviteroutes = require('./api/routes/invitationRoutes');
var authentificationroutes = require('./api/routes/authentification');
var transactionroutes = require('./api/routes/transaction');
var userroutes = require('./api/routes/UserRoutes');
var coursroutes = require('./api/routes/CoursRoutes');

authentificationroutes(app);
userroutes(app);
coursroutes(app);
transactionroutes(app);
//inviteroutes(app);
//userroutes(app);
//seanceroutes(app);

cotationscript.check();

app.listen(port);


console.log('RESTful API server started on: ' + port);