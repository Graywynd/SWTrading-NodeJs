const Babysitter = require('../models/BabysitterModel'); // Import User Model Schema
const Parent = require('../models/ParentModel'); // Import User Model Schema
const Seance = require('../models/SeanceModel'); // Import Blog Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../../config/database'); // Import database configuration

module.exports = (router) => {


  router.post('/Seances/newSeance', (req, res) => {
    // Check if blog title was provided
    if (!req.body.title) {
      res.json({ success: false, message: 'Titre Seance est requis.' }); // Return error message
    } else {
      // Check if blog body was provided
      if (!req.body.body) {
        res.json({ success: false, message: 'Description Seance est requis.' }); // Return error message
      } else {
        // Check if blog's creator was provided
        if (!req.body.createdBy) {
          res.json({ success: false, message: 'Créateur de seance est requis.' }); // Return error
        } else {
          // Create the blog object for insertion into database
          const seance = new Seance({
            title: req.body.title, // Title field
            body: req.body.body, // Body field
            createdBy: req.body.createdBy, // CreatedBy field
            StartAt : req.body.start
          });
          // Save blog into database
          seance.save((err) => {
            // Check if error
            if (err) {
              // Check if error is a validation error
              if (err.errors) {
                // Check if validation error is in the title field
                if (err.errors.title) {
                  res.json({ success: false, message: err.errors.title.message }); // Return error message
                } else {
                  // Check if validation error is in the body field
                  if (err.errors.body) {
                    res.json({ success: false, message: err.errors.body.message }); // Return error message
                  } else {
                    res.json({ success: false, message: err }); // Return general error message
                  }
                }
              } else {
                res.json({ success: false, message: err }); // Return general error message
              }
            } else {
              res.json({ success: true, message: 'Seance enregistrée !' }); // Return success message
            }
          });
        }
      }
    }
  });


   router.get('/Seance/allSeances', (req, res) => {
    // Search database for all blog posts
    Seance.find({}, (err, seances) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!seances) {
          res.json({ success: false, message: 'pas de seances trouvés.' }); // Return error of no blogs found
        } else {
          res.json({ success: true, seances: seances }); // Return success and blogs array
        }
      }
    }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
  });


  router.get('/Seance/singleSeance/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'Id seance non fourni.' }); // Return error message
    } else {
      // Check if the blog id is found in database
      Seance.findOne({ _id: req.params.id }, (err, seance) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Id seance invalid' }); // Return error message
        } else {
          // Check if blog was found by id
          if (!seance) {
            res.json({ success: false, message: 'Seance introuvable.' }); // Return error message
          } else {
            // Find the current user that is logged in
            Parent.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error
              } else {
                // Check if username was found in database
                if (!user) {
                  res.json({ success: false, message: 'Echec authentification utilisateur ' }); // Return error message
                } else {
                  // Check if the user who requested single blog is the one who created it
                  if (user.username !== seance.createdBy) {
                    res.json({ success: false, message: 'Seance inchangée : autorisation refusée .' }); // Return authentication reror
                  } else {
                    res.json({ success: true, seance: seance }); // Return success
                  }
                }
              }
            });
          }
        }
      });
    }
  });


  router.put('/Seance/updateSeance', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'Id seance non fourni' }); // Return error message
    } else {
      // Check if id exists in database
      Seance.findOne({ _id: req.body._id }, (err, seance) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Id seance invalid' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!seance) {
            res.json({ success: false, message: 'Seance introuvable.' }); // Return error message
          } else {
            // Check who user is that is requesting blog update
            Parent.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Echec authentification utilisateur' }); // Return error message
                } else {
                  // Check if user logged in the the one requesting to update blog post
                  if (user.username !== seance.createdBy) {
                    res.json({ success: false, message: 'Seance inchangée : autorisation refusée .' }); // Return error message
                  } else {
                    seance.title = req.body.title; // Save latest blog title
                    seance.body = req.body.body;
                    seance.StartAt = req.body.date;  
                    seance.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Assurez-vous que le formulaire est rempli correctement' });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Seance Modifiée!' }); // Return success message
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

   router.delete('/Seance/deleteSeance/:id', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'Id seance non fourni.' }); // Return error message
    } else {
      // Check if id is found in database
      Seance.findOne({ _id: req.params.id }, (err, seance) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Id seance invalid' }); // Return error message
        } else {
          // Check if blog was found in database
          if (!seance) {
            res.json({ success: false, messasge: 'Seance introuvable.' }); // Return error message
          } else {
            // Get info on user who is attempting to delete post
            Parent.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: err }); // Return error message
              } else {
                // Check if user's id was found in database
                if (!user) {
                  res.json({ success: false, message: 'Echec authentification utilisateur' }); // Return error message
                } else {
                  // Check if user attempting to delete blog is the same user who originally posted the blog
                  if (user.username !== seance.createdBy) {
                    res.json({ success: false, message: 'Seance inchangée : autorisation refusée ' }); // Return error message
                  } else {
                    // Remove the blog from database
                    seance.remove((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Seance supprimée!' }); // Return success message
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.put('/Seance/likeSeance', (req, res) => {
    // Check if id was passed provided in request body
    if (!req.body.id) {
      res.json({ success: false, message: 'Id seance non fourni.' }); // Return error message
    } else {
      // Search the database with id
      Seance.findOne({ _id: req.body.id }, (err, seance) => {
        // Check if error was encountered
        if (err) {
          res.json({ success: false, message: 'Id seance invalid' }); // Return error message
        } else {
          // Check if id matched the id of a blog post in the database
          if (!seance) {
            res.json({ success: false, message: 'Seance introuvable.' }); // Return error message
          } else {
            // Get data from user that is signed in
            Babysitter.findOne({ _id: req.decoded.userId }, (err, user) => {
              // Check if error was found
              if (err) {
                res.json({ success: false, message: 'Quelque chose a mal tourné' }); // Return error message
              } else {
                // Check if id of user in session was found in the database
                if (!user) {
                  res.json({ success: false, message: 'Echec authentification utilisateur' }); // Return error message
                } else {
                  // Check if user who liked post is the same user that originally created the blog post
                  if (user.username === seance.createdBy) {
                    res.json({ success: false, messagse: 'Impossible de montrer intéret dans votre propre seance.' }); // Return error message
                  } else {
                    // Check if the user who liked the post has already liked the blog post before
                   
                    if (seance.InterestedBy.includes(user.username)) {
                      res.json({ success: false, message: 'Vous avez déjà montré intéret dans cette seance.' }); // Return error message
                    } else {
                      
                        seance.interested++; // Incriment likes
                        seance.InterestedBy.push(user.username); // Add liker's username into array of likedBy
                        // Save seance post
                        seance.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Quelque chose a mal tourné.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Intéret enregistré!' }); // Return success message
                          }
                        });
                      
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

   router.get('/Seance/getCount', (req, res) => {
    Seance.count({}, function(err , count){
         res.json({ success: true, num: count });
        });
  });

  return router;
};
