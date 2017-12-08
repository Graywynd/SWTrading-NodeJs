'use strict';

const Cours = require('../models/CoursModel'); // Import Blog Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../../config/database'); // Import database configuration

module.exports = (router) => {
//  var UserController = require('../controllers/UserController');

router.get('/allCours', (req, res) => {
    // Search database for all blog posts
    Cours.find({}, (err, cours) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!cours) {
          res.json({ success: false, message: 'pas de cours dans la BD.' }); // Return error of no blogs found
        } else {
          res.json({ success: true, cours: cours }); // Return success and blogs array
        }
      }
    }).sort({ 'nom': 1 });
  });


  router.get('/getCours/:name', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.name) {
      res.json({ success: false, message: 'nom cours non fourni.' }); // Return error message
    } else {
      // Check if the blog id is found in database
      Cours.findOne({ nom : req.params.name.toUpperCase() }, (err, cours) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Id cours invalid' }); // Return error message
        } else {
          // Check if blog was found by id
          if (!cours) {
            res.json({ success: false, message: 'cours introuvable.' }); // Return error message
          } else {
            res.json({ success: true, cours: cours }); 
           
          }
        }
      });
    }
  });

 

  
  
  router.get('/getCoursCount', (req, res) => {
    Cours.count({}, function(err , count){
         res.json({ success: true, num: count });
        });
  });

};
