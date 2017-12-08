const User = require('../models/UserModel');
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../../config/database'); // Import database configuration
const request = require('request');


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
                                 "symbol": req.body.symbol
                                }
                                        }

                console.log(options.form);

                request(options, function (error, response, body) {
                      if (!error && response.statusCode == 200) {
                            // Print out the response body
                                console.log("sent post api");
                               //console.log(body);
                               res.json({ success: true, message: 'Transaction validée' });
                          }else{
                              console.log(error);
                              res.json({ success: false, message: 'Transaction non validée' });
                          }
                        });
          

        
        }
        }
      }
    }
  });

 




  return router; // Return router object to main index.js
}