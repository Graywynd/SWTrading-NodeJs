const Babysitter = require('../models/BabysitterModel'); // Import User Model Schema
const Parent = require('../models/ParentModel'); // Import User Model Schema
const Invitation = require('../models/InvitationModel'); // Import Blog Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../../config/database'); // Import database configuration


module.exports = (router) => {


  router.post('/Invitations/newInvitation', (req, res) => {
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
          const invitation = new Invitation ({
            title: req.body.title, // Title field
            body: req.body.body, // Body field
            createdBy: req.body.createdBy, // CreatedBy field
            StartAt : req.body.start,
            Invited : req.body.invited,
            duuration : req.body.duration
          });
          // Save blog into database
          invitation.save((err) => {
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
              res.json({ success: true, message: 'Invitation enregistrée !' }); // Return success message
            }
          });
        }
      }
    }
  });


  router.get('/Invitations/Parent/:username', (req, res) => {
    // Search database for all blog posts
    Invitation.find({ createdBy : req.params.username }, (err, invites) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!invites) {
          res.json({ success: false, message: 'pas d\'invitation trouvés.' }); // Return error of no blogs found
        } else {
          res.json({ success: true, invitations: invites }); // Return success and blogs array
        }
      }
    }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
  });

  router.get('/Invitations/Babysitter/:username', (req, res) => {
    // Search database for all blog posts
    Invitation.find({ Invited : req.params.username }, (err, invites) => {
      // Check if error was found or not
      if (err) {
        res.json({ success: false, message: err }); // Return error message
      } else {
        // Check if blogs were found in database
        if (!invites) {
          res.json({ success: false, message: 'pas d\'invitation trouvés.' }); // Return error of no blogs found
        } else {
          res.json({ success: true, invitations: invites }); // Return success and blogs array
        }
      }
    }).sort({ '_id': -1 }); // Sort blogs from newest to oldest
  });

  router.put('/Invitations/ConfirmInvitation', (req, res) => {
    // Check if id was passed provided in request body
    if (!req.body.id) {
      res.json({ success: false, message: 'Id invitation non fourni.' }); // Return error message
    } else {
      // Search the database with id
      Invitation.findOne({ _id: req.body.id }, (err, invite) => {
        // Check if error was encountered
        if (err) {
          res.json({ success: false, message: 'Id Invitation invalid' }); // Return error message
        } else {
          // Check if id matched the id of a blog post in the database
          if (!invite) {
            res.json({ success: false, message: 'Invitation introuvable.' }); // Return error message
          } else {
              if(invite.confirmed){
                  res.json({ success: true, message: 'Invitation Déja confirmée' }); // Return success message
              }else{
                        invite.confirmed = true; // Incriment likes
                
                        invite.save((err) => {
                          if (err) {
                            res.json({ success: false, message: 'Quelque chose a mal tourné.' }); // Return error message
                          } else {
                            res.json({ success: true, message: 'Confirmation réussite!' }); // Return success message
                          }
                        });
              }

          }
        }
      });
    }
  });

   router.get('/Invitations/singleInvitation/:id', (req, res) => {
    // Check if id is present in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'Id invitation non fourni.' }); // Return error message
    } else {
      // Check if the blog id is found in database
      Invitation.findOne({ _id: req.params.id }, (err, invite) => {
        // Check if the id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Id invitation invalid' }); // Return error message
        } else {
          // Check if blog was found by id
          if (!invite) {
            res.json({ success: false, message: 'Invitation introuvable.' }); // Return error message
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
                  if (user.username !== invite.createdBy) {
                    res.json({ success: false, message: 'Invitation inchangée : autorisation refusée .' }); // Return authentication reror
                  } else {
                    res.json({ success: true, invitation: invite }); // Return success
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.put('/Invitations/updateInvitation', (req, res) => {
    // Check if id was provided
    if (!req.body._id) {
      res.json({ success: false, message: 'Id invitation non fourni' }); // Return error message
    } else {
      // Check if id exists in database
      Invitation.findOne({ _id: req.body._id }, (err, invite) => {
        // Check if id is a valid ID
        if (err) {
          res.json({ success: false, message: 'Id invitation invalid' }); // Return error message
        } else {
          // Check if id was found in the database
          if (!invite) {
            res.json({ success: false, message: 'Invitation introuvable.' }); // Return error message
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
                  if (user.username !== invite.createdBy) {
                    res.json({ success: false, message: 'Invitation inchangée : autorisation refusée .' }); // Return error message
                  } else {
                    if(invite.confirmed){
                      res.json({ success: false, message: 'Invitation est déja confirmée : autorisation refusée ' }); 
                    }else{
                    invite.title = req.body.title; // Save latest blog title
                    invite.body = req.body.body;
                    invite.StartAt = req.body.date;  
                    invite.duration = req.body.duration;
                    invite.save((err) => {
                      if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Assurez-vous que le formulaire est rempli correctement' });
                        } else {
                          res.json({ success: false, message: err }); // Return error message
                        }
                      } else {
                        res.json({ success: true, message: 'Invitation Modifiée!' }); // Return success message
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

    router.delete('/Invitations/deleteInvitation/:id', (req, res) => {
    // Check if ID was provided in parameters
    if (!req.params.id) {
      res.json({ success: false, message: 'Id invitation non fourni.' }); // Return error message
    } else {
      // Check if id is found in database
      Invitation.findOne({ _id: req.params.id }, (err, invite) => {
        // Check if error was found
        if (err) {
          res.json({ success: false, message: 'Id invitation invalid' }); // Return error message
        } else {
          // Check if blog was found in database
          if (!invite) {
            res.json({ success: false, messasge: 'Invitation introuvable.' }); // Return error message
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
                  if (user.username !== invite.createdBy) {
                    res.json({ success: false, message: 'Invitation inchangée : autorisation refusée ' }); // Return error message
                  } else {

                    if(invite.confirmed){
                      res.json({ success: false, message: 'Invitation est déja confirmée : autorisation refusée ' }); 
                    }else{
                    // Remove the blog from database
                    invite.remove((err) => {
                      if (err) {
                        res.json({ success: false, message: err }); // Return error message
                      } else {
                        res.json({ success: true, message: 'Invitation supprimée!' }); // Return success message
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

   router.get('/Invitations/getCountParent/:username', (req, res) => {
    Invitation.count({createdBy : req.params.username}, function(err , count){
      if(err){
       res.json({ success: false, message: err });
      }else{
         res.json({ success: true, num: count });
    }
        });
  });

  router.get('/Invitations/getCountBabysitter/:username', (req, res) => {
    Invitation.count({Invited : req.params.username}, function(err , count){
      if(err){
       res.json({ success: false, message: err });
      }else{
         res.json({ success: true, num: count });
    }
        });
  });

  






   

   return router;
};