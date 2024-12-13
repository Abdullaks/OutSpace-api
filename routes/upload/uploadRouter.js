const express = require("express");
const router = express.Router();
const { verifyUser } = require("../../middleware/authMiddleware");
const imageUpload = require("../../middleware/imageUpload");
const uploadCtlr = require("./uploadController");

router
  .post("/uploadImages", verifyUser, imageUpload, uploadCtlr.uploadImages)
  .get("/getImages", uploadCtlr.getImages);

module.exports = router;
