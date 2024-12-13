const express = require("express");
const router = express.Router();
const adminCtlr = require("./adminController");

router
  .get("/", adminCtlr.getAllUsers)
  .delete("/deleteUser/:id", adminCtlr.deleteUser)
  .put("/blockUser/:id", adminCtlr.blockUser)
  .put("/unBlockUser/:id", adminCtlr.unBlockUser);

module.exports = router;
