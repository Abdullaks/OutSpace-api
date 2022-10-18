const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  checkUser,
  otpSend,
  otpConfirmation,
  verifyMobile,
  updatePassword,
  loginAdmin,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/adminLogin", loginAdmin);
router.post("/CheckUser", checkUser);
router.post("/otpSend", otpSend);
router.post("/otpConfirmation", otpConfirmation);
router.post("/verifyMobile", verifyMobile);
router.post("/updatePassword", updatePassword);

module.exports = router;
