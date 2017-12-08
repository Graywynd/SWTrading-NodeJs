'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const info = require('../../config/info'); // Import database configuration




var ValeurSchema = new Schema({
  nom: {
    type: String,
   
  },
  quantite: {
    type: String,
   
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  cour: {
    type: Schema.Types.ObjectId,
    ref: 'Cours'
  }


});



module.exports = mongoose.model('Valeurs', ValeurSchema);