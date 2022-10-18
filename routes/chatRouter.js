const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/authMiddleware");
const {
  newconversation,
  getConversation,
  newmessage,
  allmessage,
} = require("../controllers/chatController");

router.post("/", verifyUser, newconversation);
router.get("/:userId", verifyUser, getConversation);
router.post("/newMessage", verifyUser, newmessage);
router.get("/allMessage/:conversationId", verifyUser, allmessage);

module.exports = router;
