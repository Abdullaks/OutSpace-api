const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");
const ServiceSID = process.env.ServiceSID;
const AccountSID = process.env.AccountSID;
const authToken = process.env.authToken;
const client = require("twilio")(AccountSID, authToken);

//lOGIN ADMIN
const loginAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(404).json(" Such admin not found");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!validPassword) {
      return res.status(400).json("password incorrect");
    }
    res.status(200).json({
      _id: admin.id,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//REGISTER
const registerUser = async (req, res) => {
  console.log(req.body);
  try {
    //check if user is already registered
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(400).json("this email is already taken");
    }
    //generate hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      mobile: req.body.mobile,
      password: hashedPassword,
    });

    //save the new user and response
    const user = await newUser.save();
    console.log(user, "sdfghjk");
    if (user) {
      res.status(200).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//CREATE JWT TOKEN
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//lOGIN USER
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("user not found");
    }
    if (user.isBlock) {
      return res.status(400).json("You are blocked by admin");
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json("password incorrect");
    }
    res.status(200).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      profilePicture: user.profilePicture ? user.profilePicture : null,
      savedPosts: user.savedPosts? user.savedPosts:null,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//USER VERIFICATION
const checkUser = async (req, res) => {
  try {
    const existingMail = await User.findOne({ email: req.body.email });
    const existingName = await User.findOne({ username: req.body.username });
    if (existingMail) {
      console.log("exist email");
      res.status(200).json("emailExist");
    } else if (existingName) {
      console.log("exist name");
      res.status(200).json("nameExist");
    } else {
      res.status(200).json("noUser");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//OTP CREATING
const otpSend = async (req, res) => {
  try {
    client.verify.services(ServiceSID).verifications.create({
      to: `+91${req.body.mobile}`,
      channel: "sms",
    });
    console.log("otp send");
    res.status(200).json("success");
  } catch (err) {
    console.log("error");
    res.status(500).json(err);
  }
};

//OTP CONFIRMATION
const otpConfirmation = async (req, res) => {
  try {
    client.verify
      .services(ServiceSID)
      .verificationChecks.create({
        to: `+91${req.body.mobile}`,
        code: req.body.otp,
      })
      .then((response) => {
        console.log(response);
        if (response.valid) {
          console.log("otp validated");
          res.status(200).json("otpConfirmed");
        } else {
          console.log("otp failed");
          res.status(500).json("OtpNotConfirmed");
        }
      });
  } catch (err) {
    console.log("error");
    res.status(500).json(err);
  }
};

//MOBILE VERIFICATION FORGOT PASSWORD
const verifyMobile = async (req, res) => {
  try {
    const user = await User.findOne({ mobile: req.body.mobile });
    if (user) {
      console.log("Mobile Exist");
      res.status(200).json(user.mobile);
    } else {
      res.status(200).json("noMobile");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = await User.findOne({ mobile: req.body.mobile });
    if (!user) {
      return res.status(500).json("User Not Found");
    }
    //generate hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const password = await User.findOneAndUpdate(
      { mobile: req.body.mobile },
      { $set: { password: hashedPassword } }
    );
    console.log(password, " forgot Password changed");
    const newUser = await password.save();
    res.status(200).json("forgot Password changed");
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  checkUser,
  otpSend,
  otpConfirmation,
  verifyMobile,
  updatePassword,
};
