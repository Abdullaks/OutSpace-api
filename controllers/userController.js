const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Post = require("../models/postModel");

//get profile
const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findById(req.user.id);
    const profile = await User.findOne({ username })
      .select("-password")
      .populate("followers")
      .populate("following")
      .populate("savedPosts")
      .populate({
        path: "savedPosts",
        populate: {
          path: "post",
          // select: " text images type",
        },
      })
      .populate({
        path: "savedPosts",
        populate: {
          path: "post",
          populate: {
            path: "user",
          },
        },
      });

    const followCheck = {
      following: false,
    };
    if (user.following.includes(profile._id)) {
      followCheck.following = true;
    }
    const posts = await Post.find({ user: profile._id })
      .populate("user")
      .populate("Comments")
      .populate({
        path: "Comments",
        populate: {
          path: "commentBy",
          select: "username profilePicture",
        },
      })
      .sort({ createdAt: -1 });

    res.json({ ...profile.toObject(), posts, followCheck });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//update profile picture
const updateProfilePicture = async (req, res) => {
  try {
    const { url } = req.body;
    await User.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $set: {
          profilePicture: url,
        },
      }
    );
    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update cover image
const updateCoverPicture = async (req, res) => {
  try {
    const { url } = req.body;
    await User.findByIdAndUpdate(
      { _id: req.user.id },
      {
        $set: {
          coverPicture: url,
        },
      }
    );
    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update user profile bio
const updateBio = async (req, res) => {
  console.log(req.body, "req.body");
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        bio: req.body.bio,
      },
      {
        new: true,
      }
    );
    console.log(updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//follow a user
const follow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        !receiver.followers.includes(sender._id) &&
        !sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $push: { followers: sender._id },
        });

        await sender.updateOne({
          $push: { following: receiver._id },
        });
        res.json({ message: "follow success" });
      } else {
        return res.status(400).json({ message: "Already following" });
      }
    } else {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//unFollow user
const unFollow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      if (
        receiver.followers.includes(sender._id) &&
        sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });

        await sender.updateOne({
          $pull: { following: receiver._id },
        });
        res.json({ message: "unfollow success" });
      } else {
        return res.status(400).json({ message: "Already not following" });
      }
    } else {
      return res.status(400).json({ message: "You can't unfollow yourself" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const search = async (req, res) => {
//   try {
//     const searchTerm = req.params.searchTerm;
//     const results = await User.find({ $text: { $search: searchTerm } }).select(
//       "username name profilePicture"
//     );
//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

//search All Users in header
const allUsers = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm
      ? {
          $or: [
            { name: { $regex: req.params.searchTerm, $options: "i" } },
            { username: { $regex: req.params.searchTerm, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(searchTerm).find({
      _id: { $ne: req.user.id },
    });
    console.log(users);
    res.send(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get a user
const getAUser = async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await User.findById({ _id: userId });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getProfile,
  updateProfilePicture,
  updateCoverPicture,
  updateBio,
  follow,
  unFollow,
  getAUser,
  allUsers,
};
