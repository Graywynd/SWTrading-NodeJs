'use strict';
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const info = require('../../config/info'); // Import database configuration




var OrderSchema = new Schema({
  valeur: {
    type: String,
   
  },
  va: {
    type: String,
   
  },
  quantite: {
    type: String,
  },
  type: {
    type: String,

  },
  status: {
    type: String,
    default : "En cours"
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }


});



module.exports = mongoose.model('Orders', OrderSchema);