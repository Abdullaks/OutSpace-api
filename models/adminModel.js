const mongoose = require("mongoose");

const adminSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "please Add an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "please Add a password"],
    min: 8,
  },
});

module.exports = mongoose.model("Admin", adminSchema);
