const User = require('../models/UserModel');
const Cours = require('../models/CoursModel');
const Valeur = require('../models/ValeurModel');
const Historique = require('../models/HistoriqueModel');
const Order = require('../models/OrderModel');
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../../config/database'); // Import database configuration
const request = require('request');
var functionsscript = require("./functions");


module.exports = (router) => {
  /* ==============
     Register Route
  ============== */
  router.post('/execTransaction', (req, res) => {

    // Check if email was provided
    if (!req.body.side) {
      res.json({ success: false, message: 'Voulez vous acheter ou vendre?'}); // Return error
    } else {
      // Check if username was provided
      if (!req.body.ordertype) {
        res.json({ success: false, message: 'Veuillez indiquer le type de lordre' }); // Return error
      } else {
        // Check if password was provided
        if (!req.body.orderqty) {
          res.json({ success: false, message: 'Veuillez indiquer la quantité' }); // Return error
        } else {
            if (!req.body.price) {
            res.json({ success: false, message: 'Veuillez indiquer le prix' }); // Return error
          } else {
               if (!req.body.username) {
                res.json({ success: false, message: 'Veuillez fournir le nom utilisateur' });
               } else {   
                 User.findOne({ username : req.body.username.toLowerCase() }, (err, user) => {
                     // Check if the id is a valid ID
                   if (err) {
                     console.log("error retreiving user");
                   }else{
                      if (!req.body.nomCours) {
                        res.json({ success: false, message: 'Veuillez fournir le nom de cours' });
                      } else {
                        Cours.findOne({ nom : req.body.nomCours.toUpperCase() }, (err, cours) => {
                            if (err) {
                            console.log("error retreiving cours");
                          } else {

                            if(req.body.ordertype.toLowerCase() == "market" ){
                              req.body.price = cours.dernier;
                            }
                           
                            if(req.body.side.toLowerCase() == "buy"){
                              var cost = parseInt(req.body.orderqty) * parseFloat(req.body.price);
                                if(cost > parseFloat(user.portfoliobalance)){
                                  res.json({ success: false, message: 'Impossible de traiter la transaction. Balance insuffisant. ' });
                                }
                            }

                            if(req.body.side.toLowerCase() == "sell"){

                              Valeur.findOne({ nom : req.body.nomCours},{ user : user._id}).select("nom quantite user cour").exec( (err, valeur) => {
                                // Check if the id is a valid ID
                              if (err) {
                                console.log("error retreiving valeur");
                              }else{
                                if (!valeur) {
                                  res.json({ success: false, message: 'vous ne possédez pas de valeurs de cet cours.' }); // Return error of no blogs found
                                } else {
                                  if(parseInt(valeur.quantite) < parseInt(req.body.orderqty)){
                                    res.json({ success: false, message: 'Vous ne possédez pas d\'assez de valeurs. ' });
                                  }
                                }
                            }
                          }); 
                          }
              
               console.log("user " + user.username);
               console.log("cours " + cours.nom);

                var headers = {
                    'User-Agent':       'Super Agent/0.0.1',
                   'Content-Type':     'application/json'
                    }

                var options = {
                         url: 'http://localhost:8080/processTransaction',
                         method: 'POST',
                         headers: headers,
                         json: { "orderid": req.body.orderid, 
                                 "ordertype": req.body.ordertype,
                                 "orderqty": req.body.orderqty,
                                 "side": req.body.side,
                                 "price": req.body.price,
                                 "symbol": req.body.symbol,
                                 "user" : user,
                                 "cours" : cours
                                }
                                        }

                

                request(options, function (error, response, body) {
                      if (!error && response.statusCode == 200) {
                            // Print out the response body
                                console.log("sent post api");
                               //console.log(body);

                               User.findOne({ username : options.json.user.username.toLowerCase() }, (err, user) => {
                                // Check if the id is a valid ID
                              if (err) {
                                res.json({ success: false, message: 'nom utilisateur invalid' }); // Return error message
                              } else {
                                // Check if blog was found by id
                                if (!user) {
                                  res.json({ success: false, message: 'Utilisateur introuvable.' }); // Return error message
                                } else {
                                  
                                  let historique = new Historique({
                                    valeur: options.json.cours.nom,
                                    va: req.body.side,
                                    type: req.body.ordertype,
                                    user: user._id
                        
                                  });

                                  historique.save((err) => {
                                    // Check if error occured
                                    if (err) {
                                      console.log(err);
                                    } else {
                                      console.log("transaction ajoutée a historique");
                                    }
                                  });

                                  let order = new Order({
                                    valeur: options.json.cours.nom,
                                    va: options.json.side,
                                    quantite : options.json.orderqty,
                                    type: req.body.ordertype,
                                    user: user._id
                        
                                  });

                                  order.save((err) => {
                                    // Check if error occured
                                    if (err) {
                                      console.log(err);
                                    } else {
                                      console.log("order sauvegardé");
                                    }
                                  });

                                  

                                  if(req.body.side.toLowerCase() == "buy"){
                                     Valeur.findOne({ nom : options.json.cours.nom},{ user : user._id}).select("nom quantite moyenpondere derniercours variation user cour").exec(function(err, valeur) {
                                          if(!err) {
                                              if(!valeur) {
                                                valeur = new Valeur();
                                                valeur.nom = options.json.cours.nom;
                                                valeur.quantite = (parseInt(options.json.orderqty)).toString();
                                                valeur.moyenpondere = options.json.price;
                                                valeur.derniercours = options.json.cours.dernier;
                                                valeur.variation = "0";
                                                valeur.user = user._id;
                                                valeur.cour = options.json.cours._id;
                                              }else{
                                              
                                              var moyenpondere = parseFloat(valeur.moyenpondere);
                                              //console.log("moyen pondere" + moyenpondere);
                                              var derniercours = parseFloat(valeur.derniercours);
                                              //console.log("dernier cours" + derniercours);
                                              var variation =  parseFloat(valeur.variation);
                                              //console.log("variation" + variation);
                                              var quantite = parseInt(valeur.quantite);
                                              //console.log("quantite" + quantite);
                                              var newprice = parseInt(options.json.price);

                                              var addedquantite = parseInt(options.json.orderqty);
                                              //console.log("added quantite" + addedquantite);
                                              var newquantite = parseInt(valeur.quantite) + parseInt(options.json.orderqty);
                                              //console.log("new quantite" + newquantite);

                                              var newderniercours = parseFloat(options.json.cours.dernier);
                                              //console.log("new dernier cours" + newderniercours);
                                              var newmyenpondere = (((moyenpondere*quantite)/newquantite) + ((newprice*addedquantite)/newquantite));
                                              //console.log("new moyen pondere" + newmyenpondere);
                                              var newvariation  = newmyenpondere - newderniercours;
                                              //console.log("new varaition" + newvariation);
                                              
                                              valeur.moyenpondere = newmyenpondere.toString();
                                              valeur.derniercours = newderniercours.toString();
                                              valeur.variation = newvariation.toString();
                                              valeur.quantite = newquantite.toString();
                                              
                                              }
                                              valeur.save(function(err) {
                                                  if(!err) {
                                                      console.log("");
                                                  }
                                                  else {
                                                      console.log("Error: could not save valeur " + options.json.cours.nom);
                                                  }
                                              });
                                          }
                                      });
                                      var cost = parseInt(options.json.orderqty) * parseFloat(options.json.price);
                                      var newbalance = (parseFloat(user.portfoliobalance) - cost).toString();
                                      User.update({_id: user._id}, {$set: {'portfoliobalance': newbalance}}).exec();

                                  }

                                  if(req.body.side.toLowerCase() == "sell"){
                                    Valeur.findOne({ nom : options.json.cours.nom},{ user : user._id}).select("nom quantite moyenpondere derniercours variation user cour").exec(function(err, valeur) {
                                         if(!err) {
                                             if(!valeur) {
                                               valeur = new Valeur();
                                               valeur.nom = options.json.cours.nom;
                                               valeur.quantite = (parseInt(options.json.orderqty)).toString();
                                               valeur.moyenpondere = options.json.price;
                                               valeur.derniercours = options.json.cours.dernier;
                                               valeur.variation = "0";
                                               valeur.user = user._id;
                                               valeur.cour = options.json.cours._id;
                                             }else{
                                             var moyenpondere = parseFloat(valeur.moyenpondere);
                                             var derniercours = parseFloat(valeur.derniercours);
                                             var variation =  parseFloat(valeur.variation);
                                             var quantite = parseInt(valeur.quantite);
                                             var newprice = parseInt(options.json.price);

                                             var addedquantite = parseInt(options.json.orderqty);
                                             var newquantite = parseInt(valeur.quantite) - parseInt(options.json.orderqty);
                                             
                                             var newderniercours = parseFloat(options.json.cours.dernier);
                                             var newmyenpondere = (((moyenpondere*quantite)/newquantite) - ((newprice*addedquantite)/newquantite));
                                             
                                             var newvariation  = newmyenpondere - newderniercours;

                                              
                                             valeur.moyenpondere = newmyenpondere.toString();
                                             valeur.derniercours = newderniercours.toString();
                                             valeur.variation = newvariation.toString();
                                             valeur.quantite = newquantite.toString();
                                             }
                                             valeur.save(function(err) {
                                                 if(!err) {
                                                     console.log("");
                                                 }
                                                 else {
                                                     console.log("Error: could not save valeur " + options.json.cours.nom);
                                                 }
                                             });
                                         }
                                     });
                                     var cost = parseInt(options.json.orderqty) * parseFloat(options.json.price);
                                     var newbalance = (parseFloat(user.portfoliobalance) + cost).toString();
                                     User.update({_id: user._id}, {$set: {'portfoliobalance': newbalance}}).exec();
                                 }

                                 
                                }
                              }
                              
                            });

                               res.json({ success: true, message: 'Transaction validée' });
                          }else{
                              console.log(error);
                            

                              res.json({ success: false, message: 'Transaction non validée' });
                          }
                        });
          

                      } 
                    });
                  }
                      }
                  });
              }
        }
        }
      }
    }
  });

 




  return router; // Return router object to main index.js
}