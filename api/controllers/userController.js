'use strict';


var mongoose = require('mongoose'),
  Parents = mongoose.model('Parents'),
  Babysitters = mongoose.model('Babysitters');

exports.create_a_parent = function(req, res) {
  var new_parent = new Parents(req.body);
  new_parent.save(function(err, parent) {
    if (err)
      res.send(err);
    res.json(parent);
  });
};


exports.get_a_parent = function(req, res) {
  Parents.findById(req.params.parentId, function(err, parent) {
    if (err)
      res.send(err);
    res.json(parent);
  });
};


exports.update_a_parent = function(req, res) {
  Parents.findOneAndUpdate({_id: req.params.parentId}, req.body, {new: true}, function(err, parent) {
    if (err)
      res.send(err);
    res.json(parent);
  });
};


exports.delete_a_parent = function(req, res) {


  Parents.remove({
    _id: req.params.parentId
  }, function(err, parent) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};



exports.list_all_babysitters = function(req, res) {
  Babysitters.find({}, function(err, babysitter) {
    if (err)
      res.send(err);
    res.json(babysitter);
  });
};




exports.create_a_babysitter = function(req, res) {
  var new_babysitter = new Babysitters(req.body);
  new_babysitter.save(function(err, babysitter) {
    if (err)
      res.send(err);
    res.json(babysitter);
  });
};


exports.get_a_babysitter = function(req, res) {
  Babysitters.findById(req.params.babysitterId, function(err, babysitter) {
    if (err)
      res.send(err);
    res.json(babysitter);
  });
};


exports.update_a_babysitter = function(req, res) {
  Babysitters.findOneAndUpdate({_id: req.params.babysitterId}, req.body, {new: true}, function(err, babysitter) {
    if (err)
      res.send(err);
    res.json(babysitter);
  });
};


exports.delete_a_babysitter = function(req, res) {


  Babysitters.remove({
    _id: req.params.babysitterId
  }, function(err, babysitter) {
    if (err)
      res.send(err);
    res.json({ message: 'Task successfully deleted' });
  });
};
