var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  config = require('./config/database'),
  Parents = require('./api/models/ParentModel'),
  Babysitters = require('./api/models/BabysitterModel'),
  bodyParser = require('body-parser');
  const cors = require('cors');
  
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
	if (err){
		console.log('could not connect to database : ', err);
	}else{
		console.log('connected to database: '+ config.db);
	}
}); 

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var userroutes = require('./api/routes/UserRoutes');
var authentificationroutes = require('./api/routes/authentification');
var seanceroutes = require('./api/routes/seanceRoutes');

authentificationroutes(app);
userroutes(app);
seanceroutes(app);

app.listen(port);


console.log('todo list RESTful API server started on: ' + port);