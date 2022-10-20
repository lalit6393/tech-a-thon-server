var express = require("express");
const Meeting = require("../models/meeting");
const User = require('../models/User');
const { verifyUser } = require('../authentication');

const router = express.Router();


router.get("/:userId/event", function (req, res, next) {
     User.findById(req.params.userId)
     .then((user) => {
      if(user != null){
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user.eventsByYou);
      }
      else{
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.json({success:false, status: "Data not found"});
      }
     }, err => next(err))
     .catch((err) => {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({success:false, status: "User not found"});
     });
});


router.post('/:userId/event', (req, res, next) => {
  User.findById(req.params.userId)
  .then((user) => {
    if(user != null ){
     user.eventsByYou.push(req.body);
     user.save()
     .then((user) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({eventCreated: user.eventsByYou});
     }, (err) => next(err))
     .catch((err) => {
      res.statusCode = 404;
      res.setHeader("Content-Type", "application/json");
      res.json({success:false, status: "Error while saving data"});8
     });
    }
    else{
      err = new Error('User ', req.params.userId, " not found");
      res.statusCode = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.json({success:false, status: "User not found"});
  });
});

router.get('/:userId/event/:eventId', (req, res, next) => {
  User.findById(req.params.userId)
  .then((user) => {
    if (user != null && user.eventsByYou.id(req.params.eventId) != null) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user.eventsByYou.id(req.params.eventId));
  }
  else if (user == null) {
      err = new Error('User ' + req.params.userId + ' not found');
      err.status = 404;
      return next(err);
  }
  else {
      err = new Error('Event ' + req.params.eventId + ' not found');
      err.status = 404;
      return next(err);            
  }
  })
  .catch((err) => next(err));
});

router.delete('/:userId/event/:eventId/remove', (req, res, next) => {
 User.findById(req.params.userId).then((user) => {
    console.log(user.eventsByYou);
      if(user != null && user.eventsByYou.id(req.params.eventId) != null){
        user.eventsByYou.id(req.params.eventId).remove();
        user.save()
        .then((user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user.eventsByYou);
        }, (err) => {
          console.log("from i user",err);
          return next(err);
        })
        .catch((err) => {
          console.log("from catch",err);
          return next(err);
        });
      }
      else{
        err = new Error('User ', req.params.userId, " not found");
        res.statusCode = 404;
        return next(err);
      }
  }, (err) => {
    console.log("from i-2 user",err);
    return next(err);
  })
  .catch((err) => {
    console.log("from user",err);
    return next(err);
  });
});


module.exports = router;
