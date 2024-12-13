const express = require("express");
const router = express.Router();
const { verifyUser } = require("../../middleware/authMiddleware");
const postCtlr = require("./postController");

router
  .post("/createPost", verifyUser, postCtlr.createPost)
  .get("/getAllPosts", verifyUser, postCtlr.getAllPosts)
  .post("/comment", verifyUser, postCtlr.comment)
  .put("/reactPost", verifyUser, postCtlr.reactPost)
  .get("/getReacts/:id", verifyUser, postCtlr.getReacts)
  .get("/getAPost/:id", verifyUser, postCtlr.getSinglePost)
  .put("/editPost/:id", verifyUser, postCtlr.editPost)
  .put("/savePost/:id", verifyUser, postCtlr.savePost)
  .delete("/deletePost/:id", verifyUser, postCtlr.deletePost);

module.exports = router;
