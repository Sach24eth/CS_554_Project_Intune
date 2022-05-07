const cors = require("cors");
const express = require("express");
const app = express();
//const http = require("http").createServer(app);
//var io = require("socket.io")(http);
//console.log(io);
app.use(
  cors({
    origin: "*",
  })
);

app.use("/", (req, res) => {
  res.json({ msg: "sever running" });
});

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

  socket.on("user-space-create", ({ username, uid, inviteCode }) => {
    //Add user into db first
    //Join the socket room
    socket.join(inviteCode);
    console.log(username, uid, inviteCode);
    //Notify the client
    io.to(inviteCode).emit("user-space-connected", { username, inviteCode });
  });

  socket.on("user-space-connect", ({ username, uid, inviteCode }) => {
    socket.join(inviteCode);
    console.log(username, uid, inviteCode);
    io.to(inviteCode).emit("user-space-connected", { username, inviteCode });
  });

  socket.on("user-space-disconnect", ({ username, uid, inviteCode }) => {
    //Remove user from the socket db collection
    //Remove user from room
    socket.leave(inviteCode);
    //Notify client
    io.to(inviteCode).emit("user-space-disconnected", {
      username,
      inviteCode,
    });
  });

  socket.on("user-space-owner-disconnect", ({ inviteCode, uid }) => {
    //Remove the entire document from db
    //Remove users from room
    socket.leave(inviteCode);
    //Notify client
    io.to(inviteCode).emit("user-space-owner-disconnected", {
      inviteCode,
    });
  });

  socket.on("user-space-play", ({ uri, inviteCode }) => {
    console.log(uri, inviteCode);
    //Sync song to the clients
    io.to(inviteCode).emit("play", {
      uri,
    });
  });
});
const PORT = process.env.PORT || 4000;
http.listen(4000, () => {
  console.log(`listening on *:${PORT}`);
});
