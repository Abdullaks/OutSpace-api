const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/db");
const cors = require("cors");
const userRouter = require("./routes/user/userRouter");
const authRouter = require("./routes/auth/authRouter");
const adminRouter = require("./routes/admin/adminRouter");
const postRouter = require("./routes/post/postRouter");
const uploadRouter = require("./routes/upload/uploadRouter");
const chatRouter = require("./routes/chat/chatRouter");
const app = express();
dbConnect();

//middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json()); // middleware to print json data
app.use(helmet());
app.use(morgan("common"));
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//routing middleware
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/post", postRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/chat", chatRouter);

//backend port
const server = app.listen(8800, () => {
  console.log("Backend running...");
});

const io = require("socket.io")(server, {
  // pingTimeout: 60000,
  cors: {
    origin: "https://out-space-client.vercel.app",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.conversationId;

    if (!chat.members) return;

    chat.members.forEach((user) => {
      if (user == newMessageRecieved.sender._id) return;

      socket.in(user).emit("message recieved", newMessageRecieved);
    });
  });
  // socket.off("setup", () => {
  //   socket.leave(userData._id);
  // });
});
