'use strict';
const Babysitter = require('../models/BabysitterModel'); // Import User Model Schema
const Parent = require('../models/ParentModel'); // Import User Model Schema
const Seance = require('../models/SeanceModel'); // Import Blog Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../../config/database'); // Import database configuration

module.exports = (router) => {
//  var UserController = require('../controllers/UserController');

router.get('/Parents/allParents', (req, res) => {
    // Search database for all blog posts
    Parent.find({}, (err, parents) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!parents) {
          res.json({ success: false, message: 'pas de parents trouvées.' }); // Return error of no blogs found
        } else {
          res.json({ success: true, parents: parents }); // Return success and blogs array
        }
      }
    }).sort({ '_id': -1 });
  });

  router.get('/Babysitters/allBabysitters', (req, res) => {
    // Search database for all blog posts
    Babysitter.find({}, (err, babysitters) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!babysitters) {
          res.json({ success: false, message: 'pas de babysitters trouvées.' }); // Return error of no blogs found
        } else {
          res.json({ success: true, babysitters: babysitters }); // Return success and blogs array
        }
      }
    }).sort({ '_id': -1 });
  });

  router.get('/Parents/getParent/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'Id utilisateur non fourni.' }); // Return error message
    } else {
      // Check if the blog id is found in database
      Parent.findOne({ _id: req.params.id }, (err, user) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Id utilisateur invalid' }); // Return error message
        } else {
          // Check if blog was found by id
          if (!user) {
            res.json({ success: false, message: 'Utilisateur introuvable.' }); // Return error message
          } else {
            res.json({ success: true, user: user }); 
           
          }
        }
      });
    }
  });

  router.get('/Babysitters/getBabysitter/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'Id utilisateur non fourni.' }); // Return error message
    } else {
      // Check if the blog id is found in database
      Babysitter.findOne({ _id: req.params.id }, (err, user) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Id utilisateur invalid' }); // Return error message
        } else {
          // Check if blog was found by id
          if (!user) {
            res.json({ success: false, message: 'Utilisateur introuvable.' }); // Return error message
          } else {
            res.json({ success: true, user: user }); 
           
          }
        }
      });
    }
  });


  router.put('/Parents/updateParent', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'Id utilisateur non fourni' }); // Return error message
    } else {
      // Check if id exists in database
      Parent.findOne({ _id: req.body._id }).select("-password").exec((err, user) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Id utilisateur invalid' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!user) {
            res.json({ success: false, message: 'Utilisateur introuvable.' }); // Return error message
          } else {
                     user.firstname = req.body.firstname; // Save latest blog title
                    user.lastname = req.body.lastname;
                    user.email = req.body.email;
                    user.address = req.body.address;
                    user.Birthdate = req.body.Birthdate;    
                    user.profilepic = req.body.profilepic;  
                    
                    user.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: err.errors });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Utilisateur modifié !' }); // Return success message
                      }
                    });
          }
        }
      });
    }
  });

   router.put('/Babysitters/updateBabysitter', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'Id utilisateur non fourni' }); // Return error message
    } else {
      // Check if id exists in database
      Babysitter.findOne({ _id: req.body._id }, (err, user) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Id utilisateur invalid' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!user) {
            res.json({ success: false, message: 'Utilisateur introuvable.' }); // Return error message
          } else {
                    user.firstname = req.body.firstname; // Save latest blog title
                    user.lastname = req.body.lastname;
                    user.email = req.body.email;
                    user.address = req.body.address;
                    user.Birthdate = req.body.birthdate;    
                    user.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Assurez-vous que le formulaire est rempli correctement' });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Utilisateur modifié !' }); // Return success message
                      }
                    });
          }
        }
      });
    }
  });

  router.get('/Parents/getCount', (req, res) => {
    Parent.count({}, function(err , count){
         res.json({ success: true, num: count });
        });
  });


   router.get('/Babysitters/getCount', (req, res) => {
    Babysitter.count({}, function(err , count){
         res.json({ success: true, num: count });
        });
  });


  // parents Routes
 /* app.route('/parents')
    .get(UserController.list_all_parents)
    .post(UserController.create_a_parent);


  app.route('/parents/:parentId')
    .get(UserController.get_a_parent)
    .put(UserController.update_a_parent)
    .delete(UserController.delete_a_parent);
	
	 // babysitters Routes
	app.route('/babysitters')
    .get(UserController.list_all_babysitters)
    .post(UserController.create_a_babysitter);


  app.route('/babysitters/:babysitterId')
    .get(UserController.get_a_babysitter)
    .put(UserController.update_a_babysitter)
    .delete(UserController.delete_a_babysitter);

    */
};
