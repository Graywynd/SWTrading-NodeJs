'use strict';

const User = require('../models/UserModel');
const Historique = require('../models/HistoriqueModel');
const Valeur = require('../models/ValeurModel'); 
const Order = require('../models/OrderModel');   
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../../config/database'); // Import database configuration

module.exports = (router) => {
//  var UserController = require('../controllers/UserController');

router.get('/allUsers', (req, res) => {
    // Search database for all blog posts
    User.find({}, (err, users) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!users) {
          res.json({ success: false, message: 'pas de utilisateurs trouvées.' }); // Return error of no blogs found
        } else {
          res.json({ success: true, users: users }); // Return success and blogs array
        }
      }
    }).sort({ '_id': -1 });
  });


  router.get('/getUser/:username', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.username) {
      res.json({ success: false, message: 'nom utilisateur non fourni.' }); // Return error message
    } else {
       User.findOne({ username : req.params.username.toLowerCase() }, (err, user) => {
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

  router.get('/getUserHistory/:username', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.username) {
      res.json({ success: false, message: 'nom utilisateur non fourni.' }); // Return error message
    } else {
       User.findOne({ username : req.params.username.toLowerCase() }, (err, user) => {
          // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Id utilisateur invalid' }); // Return error message
        } else {
          // Check if blog was found by id
          if (!user) {
            res.json({ success: false, message: 'Utilisateur introuvable.' }); // Return error message
          } else {

            Historique.find({ user : user._id }, (err, historiques) => {
              // Check if error was found or not
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if blogs were found in database
                if (!historiques) {
                  res.json({ success: false, message: 'pas d\'historiques trouvés.' }); // Return error of no blogs found
                } else {
                  res.json({ success: true, historiques: historiques }); // Return success and blogs array
                }
              }
            }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
           
           
          }
        }
        
      });
    }
  });

  router.get('/getUserValeurs/:username', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.username) {
      res.json({ success: false, message: 'nom utilisateur non fourni.' }); // Return error message
    } else {
       User.findOne({ username : req.params.username.toLowerCase() }, (err, user) => {
          // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Id utilisateur invalid' }); // Return error message
        } else {
          // Check if blog was found by id
          if (!user) {
            res.json({ success: false, message: 'Utilisateur introuvable.' }); // Return error message
          } else {

            Valeur.find({ user : user._id }, (err, valeurs) => {
              // Check if error was found or not
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if blogs were found in database
                if (!valeurs) {
                  res.json({ success: false, message: 'pas de valeurs trouvés.' }); // Return error of no blogs found
                } else {
                  res.json({ success: true, valeurs: valeurs }); // Return success and blogs array
                }
              }
            }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
           
           
          }
        }
        
      });
    }
  });

  router.get('/getUserOrders/:username', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.username) {
      res.json({ success: false, message: 'nom utilisateur non fourni.' }); // Return error message
    } else {
       User.findOne({ username : req.params.username.toLowerCase() }, (err, user) => {
          // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Id utilisateur invalid' }); // Return error message
        } else {
          // Check if blog was found by id
          if (!user) {
            res.json({ success: false, message: 'Utilisateur introuvable.' }); // Return error message
          } else {

            Order.find({ user : user._id }, (err, orders) => {
              // Check if error was found or not
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if blogs were found in database
                if (!orders) {
                  res.json({ success: false, message: 'pas d\'ordres trouvés.' }); // Return error of no blogs found
                } else {
                  res.json({ success: true, orders: orders }); // Return success and blogs array
                }
              }
            }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
           
           
          }
        }
        
      });
    }
  });

  router.get('/addToUserBalance/:username/:balance', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.username) {
      res.json({ success: false, message: 'nom utilisateur non fourni.' }); // Return error message
    } else {
        User.findOne({ _username: req.body.username }).select("-password").exec((err, user) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Id utilisateur invalid' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!user) {
            res.json({ success: false, message: 'Utilisateur introuvable.' }); // Return error message
          } else {
                  
                if(isNaN(req.params.balance)){
                    res.json({ success: false, message: 'balance non numérique' }); 
                  }else{
                    
                      var sum = (+user.portfoliobalance) + (+req.params.balance);
                      
                      user.portfoliobalance = sum;
                    
                      user.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: err.errors });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                          }
                        } else {
                        res.json({ success: true, user: user , message: 'Utilisateur modifié !' }); // Return success message
                      }
                    });
                  }
                    
          }
        }
      });
    }
  });

  router.put('/updateUser', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'Id utilisateur non fourni' }); // Return error message
    } else {
      // Check if id exists in database
      User.findOne({ _id: req.body._id }).select("-password").exec((err, user) => {
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
                    user.country = req.body.country;    
                    user.city = req.body.city;  
                    
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

  

  
  router.get('/getUserCount', (req, res) => {
    User.count({}, function(err , count){
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



 
