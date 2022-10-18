const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/authMiddleware");
const {
  createPost,
  getAllPosts,
  comment,
  reactPost,
  getReacts,
  savePost,
  deletePost,
  getSinglePost,
  editPost,
} = require("../controllers/postController");

router.post("/createPost", verifyUser, createPost);
router.get("/getAllPosts", verifyUser, getAllPosts);
router.post("/comment", verifyUser, comment);
router.put("/reactPost", verifyUser, reactPost);
router.get("/getReacts/:id", verifyUser, getReacts);
router.get("/getAPost/:id", verifyUser, getSinglePost);
router.put("/editPost/:id", verifyUser, editPost);
router.put("/savePost/:id", verifyUser, savePost);
router.delete("/deletePost/:id", verifyUser, deletePost);

module.exports = router;
