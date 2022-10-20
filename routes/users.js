var express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authentication = require('../authentication');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/token', passport.authenticate('google-token', {session: false}), 
(req, res, next) => {
  if(req.user){
    var token = authentication.getToken({_id: req.user._id});
    console.log("userId: ", req.user._id);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, user:{firstname:req.user.firstname, lastname: req.user.lastname, id: req.user._id, token: token}, status: 'You are Logged in.'});
  }
});

router.get('/checkJWTtoken', (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true});

    }
  }) (req, res);
});

module.exports = router;
