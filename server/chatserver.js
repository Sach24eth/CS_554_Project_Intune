const cors = require("cors");
const express = require("express");
const app = express();
//const http = require("http").createServer(app);
//var io = require("socket.io")(http);
//console.log(io);
app.use(cors());

//socket connect
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("new client connected", socket.id);

  socket.on("user_join", ({ name, room }) => {
    socket.join(room);
    io.to(room).emit("user_join", { name, room });
  });

  socket.on("message", ({ name, message, room }) => {
    console.log(name, message, socket.id);
    io.to(room).emit("message", { name, message });
  });

  socket.on("disconnect", () => {
    console.log("Disconnect Fired");
  });
});

http.listen(4000, () => {
  console.log(`listening on *:${4000}`);
});
