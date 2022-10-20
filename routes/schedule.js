var express = require("express");
const Meeting = require("../models/meeting");
const User = require("../models/User");
const router = express.Router();

// public user getting meet information set by admin

router.get("/:userId/schedu", function (req, res) {
  const link = req.headers.link;
  async function getMeetingData() {
    const meetingData = await Meeting.findOne({ link: link });
    res.json(meetingData);
  }
  getMeetingData();
});

// public user setting the meet info finally

router.post("/:userId/schedu", function (req, res, next) {
  const meetLink = req.headers.link;
  try {
    console.log(req.body);
    async function createMeeting() {
      await Meeting.updateOne(
        { link: meetLink },
        {
          $set: {
            title: req.body.title,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            note: req.body.note,
            publicUser: req.body.googleId,
            open: false,
          },
        }
      );
      //   sending the final meet data
      const link = await Meeting.findOne({
        link: meetLink,
      });
      console.log(link);
      // updating public user meetings array

      await User.updateOne(
        { googleId: link.publicUser },
        { $push: { meetings: { link } } }
      );

      // updating admin user meetings array
      console.log(link.link);
      await User.updateOne(
        {
          googleId: link.admin,
          meetings: { $elemMatch: { "link.link": link.link } },
        },
        { $set: { "meetings.$[link].publicUser": req.body.googleId } },
        { arrayFilters: [{ "link.link": link.link }] }
      );
      console.log(link);
      res.send(link);
    }
    createMeeting();
  } catch (e) {
    console.log(e);
    res.statusCode(500);
  }
});

module.exports = router;
