var express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authentication = require('../authentication');

var router = express.Router();

/* GET users listing. */

router.get('/token', passport.authenticate('google-token', {session: false}), (req, res, next) => {
  if(req.user){
    var token = authentication.getToken({_id: req.user._id});
    console.log("userId: ", req.user._id);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, user:{firstname:req.user.firstname, lastname: req.user.lastname, id: req.user._id, token: token}, status: 'You are Logged in.'});
  }
});

router.post('/:userId', function(req, res, next) {
       
});

router.get('/:userId/public', function(req, res, next) {
       
});

module.exports = router;
