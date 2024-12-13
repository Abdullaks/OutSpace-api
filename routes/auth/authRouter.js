const express = require("express");
const router = express.Router();
const authCtlr = require("./authController");

router
  .post("/register", authCtlr.registerUser)
  .post("/login", authCtlr.loginUser)
  .post("/adminLogin", authCtlr.loginAdmin)
  .post("/CheckUser", authCtlr.checkUser)
  .post("/otpSend", authCtlr.otpSend)
  .post("/otpConfirmation", authCtlr.otpConfirmation)
  .post("/verifyMobile", authCtlr.verifyMobile)
  .post("/updatePassword", authCtlr.updatePassword);

module.exports = router;
