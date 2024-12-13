const express = require("express");
const router = express.Router();
const { verifyUser } = require("../../middleware/authMiddleware");
const chatCtlr = require("./chatController");

router
  .post("/", verifyUser, chatCtlr.newconversation)
  .get("/:userId", verifyUser, chatCtlr.getConversation)
  .post("/newMessage", verifyUser, chatCtlr.newmessage)
  .get("/allMessage/:conversationId", verifyUser, chatCtlr.allmessage);

module.exports = router;
