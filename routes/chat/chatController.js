const User = require("../../models/userModel");
const Conversation = require("../../models/chat/chatModel");
const Message = require("../../models/chat/messageModel");

//new conversation
const newconversation = async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get conversation of a user
const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};

//new message
const newmessage = async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    let savedMessage = await newMessage.save();
    savedMessage = await savedMessage.populate(
      "sender",
      "username profilePicture"
    );
    savedMessage = await savedMessage.populate("conversationId");
    savedMessage = await User.populate(savedMessage, {
      path: "conversationId.members",
      select: "username profilePicture email",
    });

    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get all messages from the conversation
const allmessage = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  newconversation,
  getConversation,
  newmessage,
  allmessage,
};
