'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const info = require('../../config/info'); // Import database configuration




var CourSchema = new Schema({
  nom: {
    type: String,
    unique : true,
   
  },
  ouverture: {
    type: String,
   
  },
  volume: {
    type: String,
  },
  variation: {
    type: String,

  },
  haut: {
    type: String,
  },
  bas: {
    type: String,

  },
  dernier: {
    type: String,
    
  }

});



module.exports = mongoose.model('Cours', CourSchema);