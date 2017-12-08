const Request = require('request');
const Cour = require('../models/CoursModel');

exports.check = function(){
    var data;
    Request.get('http://localhost:8080/getCotations', function (error, response, body) {
        if (error) {
            console.log(error);
            return false;
        }

        data = JSON.parse(body);

        for (var i = 0; i < data.length; i++) {
              let cour = new Cour({
                nom: data[i].nom,
                ouverture: data[i].ouverture,
                volume: data[i].volume,
                variation: data[i].variation,
                haut: data[i].haut,
                bas: data[i].bas,
                dernier: data[i].dernier
                
    
              });
           /* cour.save((err) => {
                if (err) {
                    return false; 
                }
            });
           */

          Cour.findOneAndUpdate({ "nom": data[i].nom }, { "$set": { "nom": data[i].nom, "ouverture": data[i].ouverture, "volume": data[i].volume, "variation": data[i].variation , "dernier" : data[i].dernier, "haut" : data[i].haut , "bas" : data[i].bas}}).exec(function(err, book){
            if(err) {
                console.log(err);
                return false;
            }
         });
         
        
            }

            console.log("mise a jour des cours ...")
        
        });
       // console.log(JSON.stringify(data, null, 2));
     return data;
}