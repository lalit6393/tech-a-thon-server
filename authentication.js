const passport = require('passport');
const User = require('./models/User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const GoogleTokenStrategy = require('passport-google-token').Strategy;

const config = require('./config')

exports.getToken = (user) => {
    return jwt.sign(user, config['secret-key'],
    {expiresIn: 360000});
};

var opt = {};

opt.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opt.secretOrKey = config['secret-key'];

exports.jwtPassport = passport.use(new JwtStrategy(opt,
    (jwt_payload, done) => {
        console.log("jwt_payload ",jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
                 if(err){
                    return done(err, false);
                 }
                 else if(user){
                    return done(null, user);
                 }
                 else{
                    return done(null, false);
                 }
        });
    }));


exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = (req, res, next) => {
    if(req.user.admin){
        next();
    }
    else{
        var error = new Error('You are not admin');
        res.status = 403;
        return next(error);
    }
};

exports.googlePassport = passport.use(new GoogleTokenStrategy(
    {
        clientID:config.google.clientId,
        clientSecret: config.google.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        console.log('accessToken',accessToken);
        console.log('refreshToken',refreshToken);
        User.findOne({googleId: profile.id}, (err, user) => {
            console.log('Profile: ', profile);
            if(err){
                return done(err, false);
            }
            else if(!err && user !== null){
                return done(null, user);
            } 
            else{
                user = new User({username: profile.emails[0].value});
                user.googleId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.save((err, user) => {
                    if(err){
                        return done(err, false);
                    }
                    else{
                        return done(null, user);
                    }
                });
            }
        });
    }));