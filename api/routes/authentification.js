const Parent = require('../models/ParentModel');
const Babysitter = require('../models/BabysitterModel');
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../../config/database'); // Import database configuration


module.exports = (router) => {
  /* ==============
     Register Route
  ============== */
  router.post('/register', (req, res) => {
    // Check if email was provided
    if (!req.body.email) {
      res.json({ success: false, message: 'Vous devez fournir un email' }); // Return error
    } else {
      // Check if username was provided
      if (!req.body.username) {
        res.json({ success: false, message: 'Vous devez fournir un nom utilisateur' }); // Return error
      } else {
        // Check if password was provided
        if (!req.body.password) {
          res.json({ success: false, message: 'Vous devez fournir un mot de passe' }); // Return error
        } else {

            if(req.body.usertype === "parent" ){

                // Create new user object and apply user input
          let parent = new Parent({
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password,
            gender : req.body.gender,
            address : req.body.address,
            Birthdate : req.body.birthdate

          });
          // Save user to database
          parent.save((err) => {
            // Check if error occured
            if (err) {
              // Check if error is an error indicating duplicate account
              if (err.code === 11000) {
                res.json({ success: false, message: 'Nom utilisateur ou e-mail exist déja' }); // Return error
              } else {
                // Check if error is a validation rror
                if (err.errors) {
                  // Check if validation error is in the email field
                  if (err.errors.email) {
                    res.json({ success: false, message: err.errors.email.message }); // Return error
                  } else {
                    // Check if validation error is in the username field
                    if (err.errors.username) {
                      res.json({ success: false, message: err.errors.username.message }); // Return error
                    } else {
                      // Check if validation error is in the password field
                      if (err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message }); // Return error
                      } else {
                        res.json({ success: false, message: err }); // Return any other error not already covered
                      }
                    }
                  }
                } else {
                  res.json({ success: false, message: 'Echec de sauvegarde utilisateur. Error: ', err }); // Return error if not related to validation
                }
              }
            } else {
              res.json({ success: true, message: 'Compte enregistré' }); // Return success
            }
          });

            }else if (req.body.usertype === "babysitter" ){

                // Create new user object and apply user input
          let babysitter = new Babysitter({
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password,
            gender : req.body.gender,
            address : req.body.address,
            Birthdate : req.body.birthdate
          });
          // Save user to database
          babysitter.save((err) => {
            // Check if error occured
            if (err) {
              // Check if error is an error indicating duplicate account
              if (err.code === 11000) {
                res.json({ success: false, message: 'Nom utilisateur ou e-mail exist déja' }); // Return error
              } else {
                // Check if error is a validation rror
                if (err.errors) {
                  // Check if validation error is in the email field
                  if (err.errors.email) {
                    res.json({ success: false, message: err.errors.email.message }); // Return error
                  } else {
                    // Check if validation error is in the username field
                    if (err.errors.username) {
                      res.json({ success: false, message: err.errors.username.message }); // Return error
                    } else {
                      // Check if validation error is in the password field
                      if (err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message }); // Return error
                      } else {
                        res.json({ success: false, message: err }); // Return any other error not already covered
                      }
                    }
                  }
                } else {
                  res.json({ success: false, message: 'Echec de sauvegarde utilisateur. Error: ', err }); // Return error if not related to validation
                }
              }
            } else {
              res.json({ success: true, message: 'Compte enregistré' }); // Return success
            }
          });

            }
          
        }
      }
    }
  });

  router.get('/checkEmail/:email', (req, res) => {
    // Check if email was provided in paramaters
    if (!req.params.email) {
      res.json({ success: false, message: 'Email non fourni' }); // Return error
    } else {
      // Search for user's e-mail in database;
      Parent.findOne({ email: req.params.email }, (err, user) => {
        if (err) {
          res.json({ success: false, message: err }); // Return connection error
        } else {
          // Check if user's e-mail is taken
          if (user) {
            res.json({ success: false, message: 'E-mail déja pris' }); // Return as taken e-mail
          } else {

        Babysitter.findOne({ email: req.params.email }, (err, user) => {
           if (err) {
          res.json({ success: false, message: err }); // Return connection error
          } else {
          // Check if user's e-mail is taken
          if (user) {
            res.json({ success: false, message: 'E-mail déja pris' }); // Return as taken e-mail
          } else {
            res.json({ success: true, message: 'E-mail is disponible' }); // Return as available e-mail
          }
        }
      });
            
          }
        }
      });

      

    }
  });

  /* ===============================================================
     Route to check if user's username is available for registration
  =============================================================== */
  router.get('/checkUsername/:username', (req, res) => {
    // Check if username was provided in paramaters
    if (!req.params.username) {
      res.json({ success: false, message: 'Nom utilisateur non fourni' }); // Return error
    } else {
      // Look for username in database
      Parent.findOne({ username: req.params.username }, (err, user) => {
        // Check if connection error was found
        if (err) {
          res.json({ success: false, message: err }); // Return connection error
        } else {
          // Check if user's username was found
          if (user) {
            res.json({ success: false, message: 'Nom utilisateur est pris' }); // Return as taken username
          } else {

            Babysitter.findOne({ username: req.params.username }, (err, user) => {
        // Check if connection error was found
        if (err) {
          res.json({ success: false, message: err }); // Return connection error
        } else {
          // Check if user's username was found
          if (user) {
            res.json({ success: false, message: 'Nom utilisateur est pris' }); // Return as taken username
          } else {
            res.json({ success: true, message: 'Nom utilisateur est disponible' }); // Return as vailable username
          }
        }
      });
            
          }
        }
      });
    }
  });


    /* ========
  LOGIN ROUTE
  ======== */
  router.post('/login', (req, res) => {
    // Check if username was provided
    if (!req.body.username) {
      res.json({ success: false, message: 'Nom utilisateur non fourni' }); // Return error
    } else {
      // Check if password was provided
      if (!req.body.password) {
        res.json({ success: false, message: 'Mot de passenon fourni.' }); // Return error
      } else {
        // Check if username exists in database
        Parent.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
          // Check if error was found
          if (err) {
           
            Babysitter.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: err }); // Return error
          } else {
            // Check if username was found
            if (!user) {
              res.json({ success: false, message: 'Nom utilisateur introuvable.' }); // Return error
            } else {
              const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
              // Check if password is a match
              if (!validPassword) {
                res.json({ success: false, message: 'Mot de passe invalid' }); // Return error
              } else {
                const token = jwt.sign({ userId: user._id , usertype : "babysitter" }, config.secret, { expiresIn: '24h' }); // Create a token for client
                res.json({ success: true, message: 'Succés!', token: token, user: { username: user.username , usertype : "babysitter" } }); // Return success and token to frontend
              }
            }
          }
        });
             

            

            } else {
            // Check if username was found
            if (!user) {
               
              Babysitter.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
          // Check if error was found
          if (err) {
            res.json({ success: false, message: err }); // Return error
          } else {
            // Check if username was found
            if (!user) {
              res.json({ success: false, message: 'Nom utilisateur introuvable.' }); // Return error
            } else {
              const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
              // Check if password is a match
              if (!validPassword) {
                res.json({ success: false, message: 'Mot de passe invalid' }); // Return error
              } else {
                const token = jwt.sign({ userId: user._id , usertype : "babysitter" }, config.secret, { expiresIn: '24h' }); // Create a token for client
                res.json({ success: true, message: 'Succés!', token: token, user: { username: user.username , usertype : "babysitter" } }); // Return success and token to frontend
              }
            }
          }
        }); 

             
              
            } else {
              const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
              // Check if password is a match
              if (!validPassword) {
                res.json({ success: false, message: 'Mot de passe invalid' }); // Return error
              } else {
                 const token = jwt.sign({ userId: user._id , usertype : "parent" }, config.secret, { expiresIn: '24h' }); // Create a token for client
                res.json({ success: true, message: 'Succés!', token: token, user: { username: user.username , usertype : "parent" } }); // Return success and token to frontend
              }
            }
          }
        });
      }
    }
  });

  /* ================================================
  MIDDLEWARE - Used to grab user's token from headers
  ================================================ */
  router.use((req, res, next) => {
    const token = req.headers['authorization']; // Create token found in headers
    // Check if token was found in headers
    if (!token) {
      res.json({ success: false, message: 'jeton non fourni' }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token, config.secret, (err, decoded) => {
        // Check if error is expired or invalid
        if (err) {
          res.json({ success: false, message: 'jeton invalid: ' + err }); // Return error for token validation
        } else {
          req.decoded = decoded; // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  });
 
 
  /* ===============================================================
     Route to get user's profile data
  =============================================================== */
  router.get('/profile', (req, res) => {
    // Search for user in database
    console.log(req.decoded.usetype);
    if(req.decoded.usertype === "parent"){
    Parent.findOne({ _id: req.decoded.userId }, (err, user) => {
      // Check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({ success: false, message: 'Utilisateur introuvable' }); // Return error, user was not found in db
        } else {
          res.json({ success: true, user: user }); // Return success, send user object to frontend for profile
        }
      }
    });
    }else if (req.decoded.usertype === "babysitter"){

      Babysitter.findOne({ _id: req.decoded.userId }, (err, user) => {
      // Check if error connecting
      if (err) {
        res.json({ success: false, message: err }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({ success: false, message: 'Utilisateur introuvable' }); // Return error, user was not found in db
        } else {
          res.json({ success: true, user: user }); // Return success, send user object to frontend for profile
        }
      }
    });

    }else{ res.json({ success: false, message: "Utilisateur est ni parent ni babysitter" +  err }); // Return error 
        
  }

  });

   router.get('/publicProfile/:username', (req, res) => {
    // Check if username was passed in the parameters
    if (!req.params.username) {
      res.json({ success: false, message: 'Nom utilisateur non fourni' }); // Return error message
    } else {
      // Check the database for username
      Parent.findOne({ username: req.params.username }, (err, user) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Quelque chose a mal tourné' }); // Return error message
        } else {
          // Check if user was found in the database
          if (!user) {

            Babysitter.findOne({ username: req.params.username }, (err2, user2) => {
                   // Check if error was found
                  if (err2) {
                   res.json({ success: false, message: 'Quelque chose a mal tourné' }); // Return error message
                 } else {
                    // Check if user was found in the database
                if (!user2) {
                   res.json({ success: false, message: 'Utilisateur introuvable.' }); // Return error message
                   } else {
                    res.json({ success: true, user: user2 , profiletype : "babysitter" }); // Return the public user's profile data
                    }
                   }
                  });
            
          } else {
            res.json({ success: true, user: user , profiletype : "babysitter" }); // Return the public user's profile data
          }
        }
      });
    }
  });



  return router; // Return router object to main index.js
}
