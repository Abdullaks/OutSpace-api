const User = require("../../models/userModel");

//GET ALL USERS
const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json(users);
};

//DELETE USERS
const deleteUser = async (req, res) => {
  const { id } = req.params;
  const userDelete = await User.findByIdAndDelete(id);
  res.json({ id });
};
//BLOCK USERS
const blockUser = async (req, res) => {
  const { id } = req.params;
  const userBlock = await User.findByIdAndUpdate(
    { _id: id },
    { $set: { isBlock: true } },
    { upsert: true }
  );

  res.json({ id });
};
//UNBLOCK USERS
const unBlockUser = async (req, res) => {
  const { id } = req.params;
  const userUnblock = await User.findByIdAndUpdate(
    { _id: id },
    { $set: { isBlock: false } },
    { upsert: true }
  );
  res.json({ id });
};

module.exports = {
  getAllUsers,
  deleteUser,
  blockUser,
  unBlockUser,
};
