const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
