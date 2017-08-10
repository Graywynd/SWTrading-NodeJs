const mongoose = require('mongoose'); // Node Tool for MongoDB
mongoose.Promise = global.Promise; // Configure Mongoose Promises
const Schema = mongoose.Schema; // Import Schema from Mongoose


// Validate Function to check blog title length
let titleLengthChecker = (title) => {
  // Check if blog title exists
  if (!title) {
    return false; // Return error
  } else {
    // Check the length of title
    if (title.length < 5 || title.length > 50) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid title
    }
  }
};

// Validate Function to check if valid title format
let alphaNumericTitleChecker = (title) => {
  // Check if title exists
  if (!title) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid title
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
    return regExp.test(title); // Return regular expression test results (true or false)
  }
};

// Array of Title Validators
const titleValidators = [
  // First Title Validator
  {
    validator: titleLengthChecker,
    message: 'Le titre doit comporter plus de 5 caractères mais pas plus de 50'
  },
  // Second Title Validator
  {
    validator: alphaNumericTitleChecker,
    message: 'Le titre doit être alphanumérique'
  }
];

// Validate Function to check body length
let bodyLengthChecker = (body) => {
  // Check if body exists
  if (!body) {
    return false; // Return error
  } else {
    // Check length of body
    if (body.length < 5 || body.length > 500) {
      return false; // Return error if does not meet length requirement
    } else {
      return true; // Return as valid body
    }
  }
};

// Array of Body validators
const bodyValidators = [
  // First Body validator
  {
    validator: bodyLengthChecker,
    message: 'Description doit comporter plus de 5 caractères mais pas plus de 500.'
  }
];

// Blog Model Definition
const invitationSchema = new Schema({
  title: { type: String, required: true, validate: titleValidators },
  body: { type: String, required: true, validate: bodyValidators },
  createdBy: { type: String },
  duration: { type: Number, default: 1 },
  Invited: { type: String },
  createdAt: { type: Date, default: Date.now() },
  StartAt: { type: Date, default: Date.now()+1 },
  confirmed: { type: Boolean, default: false }
});

// Export Module/Schema
module.exports = mongoose.model('Invitation', invitationSchema);