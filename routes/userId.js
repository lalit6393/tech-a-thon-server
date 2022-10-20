var express = require("express");
var router = express.Router();
const User = require("../models/User"); // in authentication.js

/* GET home page. */
router.get("/:userId", function (req, res, next) {
  async function findUser() {
    try {
      const userData = await User.findOne(
        { googleId: req.params.userId },
        { googleId: 0, createdAt: 0, updatedAt: 0 }
      );
      res.json(userData);
    } catch (e) {
      console.log(e);
    }
  }
  findUser();
});

module.exports = router;
