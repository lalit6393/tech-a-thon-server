const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const User = new Schema({
     firstname:{
        type: String,
        default: 'User'
     },
     lastname:{
        type: String,
        default: ''
     },
     googleId: String,
     admin: {
        type: Boolean,
        default: false
     }
}, {timestamps: true});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
