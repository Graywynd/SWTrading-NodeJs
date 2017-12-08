const User = require('../models/UserModel');
const Cours = require('../models/CoursModel');

exports.getUser = function(username){
    if (!username) {
       return null;
      } else {
          console.log("searcing for user");
         return User.findOne({ username : username.toLowerCase() }, (err, user) => {
            // Check if the id is a valid ID
          if (err) {
            console.log("error retreiving user");
          } else { 
              console.log(user.username + " found ");
            return user;
          }
          
        });
      }
}

exports.getCours = function(nomCours){
    
    if (!nomCours) {
        return null;
       } else {
        console.log("searcing for cours");
         return  Cours.findOne({ nom : nomCours.toUpperCase() }, (err, cours) => {
            if (err) {
            console.log("error retreiving cours");
           } else {
               console.log(cours.nom + " found ");
             return cours;
           }
           
         });
       }

}