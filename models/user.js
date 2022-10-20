const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

 const EventCreated = new Schema({
    startTime:{
      type:String,
      require:true
    },
    endTime:{
      type:String,
      require:true
    },
    title:{
      type:String,
      require:true
    },
    description:{
      type:String,
      default:''
    }
  },
  {timestamps:true}
 );

const User = new Schema({
    firstname: {
      type: String,
      default: "User",
    },
    lastname: {
      type: String,
      default: "",
    },
    googleId: String,
    admin: {
      type: Boolean,
      default: false,
    },
    eventsByYou:[EventCreated],
    meetingScheduled:[],
  },
  { timestamps: true }
);

User.plugin(passportLocalMongoose);

module.exports = new mongoose.model("User", User);
