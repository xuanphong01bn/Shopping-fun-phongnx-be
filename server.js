const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const http = require("http");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const fs = require("fs");
const { Server } = require("socket.io");
// const io = require("socket.io")(3000);

// socket

// io.on("connect", (socket) => {
//   socket.emit("chat-message", "Hello-world");
// });

// app
const app = express();
// app.use(cors());
app.use(
  cors({
    origin: "https://phongnx-shopping-fun-be.onrender.com",
    headers: ["Content-Type"],
    credentials: true,
  })
);

//db
mongoose
  .connect(
    "mongodb+srv://donhatphong94:942001SP@cluster0.agqfpaq.mongodb.net/?retryWrites=true&w=majority",
    {}
  )
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log("no database connect");
    console.log("DB Error => ", err);
  });

//middleware
app.use(morgan("dev")); // color output
app.use(bodyParser.json({ limit: "2mb" }));

//routes middleware
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require("./routes/" + r))
);
//route

//socket
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });
// io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`);

//   socket.on("join_room", (data) => {
//     socket.join(data);
//     console.log(`User with ID: ${socket.id} joined room: ${data}`);
//   });

//   socket.on("send_message", (data) => {
//     socket.to(data.room).emit("receive_message", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User Disconnected", socket.id);
//   });
// });
//port
const port = process.env.port || 8000;
// server.listen(5500, () => {
//   console.log("Server running :", 5500);
// });
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
