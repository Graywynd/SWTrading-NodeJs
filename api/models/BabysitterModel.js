'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose
const bcrypt = require('bcrypt-nodejs'); // A native JS bcrypt library for NodeJS
const info = require('../../config/info'); // Import database configuration

// Validate Function to check e-mail length
let emailLengthChecker = (email) => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (email.length < 5 || email.length > 30) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid e-mail
    }
  }
};

// Validate Function to check if valid e-mail format
let validEmailChecker = (email) => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email); // Return regular expression test results (true or false)
  }
};

// Array of Email Validators
const emailValidators = [
  // First Email Validator
  {
    validator: emailLengthChecker,
   message: 'E-mail doit comporter au moins 5 caractères mais pas plus de 30'
  },
  // Second Email Validator
  {
    validator: validEmailChecker,
    message: 'Doit être un e-mail valide'
  }
];

// Validate Function to check username length
let usernameLengthChecker = (username) => {
  // Check if username exists
  if (!username) {
    return false; // Return error
  } else {
    // Check length of username string
    if (username.length < 3 || username.length > 15) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid username
    }
  }
};

// Validate Function to check if valid username format
let validUsername = (username) => {
  // Check if username exists
  if (!username) {
    return false; // Return error
  } else {
    // Regular expression to test if username format is valid
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username); // Return regular expression test result (true or false)
  }
};

// Array of Username validators
const usernameValidators = [
  // First Username validator
  {
    validator: usernameLengthChecker,
    message: 'Nom utilisateur doit comporter au moins 3 caractères mais pas plus de 15'
  },
  // Second username validator
  {
    validator: validUsername,
     message: 'Le nom utilisateur ne doit pas comporter de caractères spéciaux'
  }
];

// Validate Function to check password length
let passwordLengthChecker = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Check password length
    if (password.length < 8 || password.length > 35) {
      return false; // Return error if passord length requirement is not met
    } else {
      return true; // Return password as valid
    }
  }
};

// Validate Function to check if valid password format
let validPassword = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Regular Expression to test if password is valid format
    const regExp = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
    return regExp.test(password); // Return regular expression test result (true or false)
  }
};

// Array of Password validators
const passwordValidators = [
  // First password validator
  {
    validator: passwordLengthChecker,
     message: 'Mot de passe  doit comporter au moins 8 caractères mais pas plus de 35'
  },
  // Second password validator
  {
    validator: validPassword,
     message: 'Doit avoir au moins une majuscule, minuscule, un caractère spécial et un nombre'
  }
];


var BabysitterSchema = new Schema({
 lastname: {
    type: String,
   
  },
  firstname: {
    type: String,
   
  },
  username: {
    type: String,
    Required: true,
    unique : true,
    validate : usernameValidators
  },
  password: {
    type: String,
    Required: true,
    validate : passwordValidators
  },
  email: {
    type: String,
    Required: true,
    unique : true,
    validate : emailValidators
  } ,
  address: {
    type: String,
    Required: true
    
  },
  gender: {
    type: String,
    Required: true
    
  },
  Birthdate: {
    type: Date
    
  },
  joindate: {
    type: Date,
    default: Date.now()
    
  },
  profilepic: {
    type: String,
    default: info.defaultpiclink
    
  }
});



// Schema Middleware to Encrypt Password
BabysitterSchema.pre('save', function(next) {
  // Ensure password is new or modified before applying encryption
  if (!this.isModified('password'))
    return next();

  // Apply encryption
  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err); // Ensure no errors
    this.password = hash; // Apply encryption to password
    next(); // Exit middleware
  });
});

// Methods to compare password to encrypted password upon login
BabysitterSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password); // Return comparison of login password to password in database (true or false)
};


module.exports = mongoose.model('Babysitters', BabysitterSchema);