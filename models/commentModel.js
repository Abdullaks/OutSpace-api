const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    Post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [true, "PostId Id is required"],
    },
    commentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
    commentText: {
      type: String,
      required: [true, "comment is required"],
    },
    commentAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
