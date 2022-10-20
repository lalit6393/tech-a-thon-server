const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const Meeting = new Schema(
  {
    link: {
      type: String,
      unique: true,
    },
    username: String,
    title: String,
    startTime: {
      type: String
      // required: true,
    },
    endTime: {
      type: String
      // required: true,
    },
    note: {
      type: String
    },
    admin: {
      type: String
    },
    publicUser: {
      type: String
    },
    open: {
      type: Boolean,
      default: true
    },
  },
  { timestamps: true }
);

Meeting.plugin(passportLocalMongoose);

module.exports = new mongoose.model("Meeting", Meeting);
