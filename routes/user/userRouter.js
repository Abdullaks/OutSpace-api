const express = require("express");
const router = express.Router();
const { verifyUser } = require("../../middleware/authMiddleware");
const userCtlr = require("./userController");

router
  .get("/getProfile/:username", verifyUser, userCtlr.getProfile)
  .put("/updateProfilePicture", verifyUser, userCtlr.updateProfilePicture)
  .put("/updateCoverPicture", verifyUser, userCtlr.updateCoverPicture)
  .put("/updateBio", verifyUser, userCtlr.updateBio)
  .put("/follow/:id", verifyUser, userCtlr.follow)
  .put("/unfollow/:id", verifyUser, userCtlr.unFollow)
  .post("/search/:searchTerm", verifyUser, userCtlr.allUsers)
  .get("/", verifyUser, userCtlr.getAUser);

module.exports = router;
