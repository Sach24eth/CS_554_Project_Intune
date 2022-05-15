const cors = require("cors");
const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const spotifyWebApi = require("spotify-web-api-node");
var cookieParser = require("cookie-parser");
const data = require("./data");
const space = data.space;

const chat = data.chatroom;
const constructor = require("./routes");

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
require("dotenv").config();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const credentials = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
};

app.get("/test", (req, res) => {
  res.send("Working...");
});

app.post("/login", async (req, res) => {
  let spotifyApi = new spotifyWebApi(credentials);

  const code = req.body.code;

  if (!code)
    return res.status(400).json({ status: 400, message: "Code required" });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ err: err });
    });
});

app.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken)
    return res
      .status(400)
      .json({ status: 400, message: "Missing refresh token." });

  credentials.refreshToken = refreshToken;
  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      return res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => res.status(400).json({ err: err }));
});

app.post("/me", async (req, res) => {
  if (!req.body.access_token)
    return res
      .status(400)
      .json({ status: 400, message: "Missing access token" });
  credentials.accessToken = req.body.access_token;
  let spotifyApi = new spotifyWebApi(credentials);

  spotifyApi
    .getMe()
    .then((data) => {
      return res.json({
        id: data.body.id,
        displayName: data.body.display_name,
        email: data.body.email,
        userImage: data.body.images,
        accountType: data.body.product,
      });
    })
    .catch((err) => res.status(400).json({ err: err }));
});

constructor(app);

io.on("connection", (socket) => {
  console.log("new client connected", socket.id);
  socket.on("user_join", async ({ name, uid, room }) => {
    try {
      socket.join(room);
      io.to(room).emit("user_join", { name, uid, room });
      const userJoin = await chat.addUsertoRoom(uid, room);
      //const addUsr = await users.addUser(uid);
      console.log("userjoin:", userJoin);
      //console.log("userDB add:", addUsr);
    } catch (e) {
      console.log(e);
    }
  });

  socket.on("message", async ({ name, uid, message, room }) => {
    console.log(name, uid, message, room);
    try {
      io.to(room).emit("message", { name, uid, message, room });
      const addMsg = await chat.addMessagesToRoom(name, uid, message, room);
      console.log("message add:", addMsg);
      //const addRoom = await users.addRoomWithMsg(uid, room);
      //console.log("user db room add:", addRoom);
    } catch (e) {
      console.log(e);
    }
  });
  socket.on("room-disconnect", async ({ uid, room }) => {
    console.log("rooms disconnect", uid, room);
    try {
      io.to(room).emit("room-disconnect", { uid, room });
      const delUsr = await chat.leaveChatroom(uid, room);
      console.log("delUsr:", delUsr);
      //const delRooom = await users.delRoomwithMessage(uid, room);
      //console.log("del Room:", delRooom);
    } catch (e) {
      console.log(e);
    }
  });
  socket.on("disconnect", () => {
    console.log("Disconnect Fired");
  });

  socket.on("user-space-create", async (data, callback) => {
    try {
      const { username, uid, inviteCode } = data;
      await space.createSpace(inviteCode, username, uid);

      socket.join(inviteCode);
    } catch (error) {
      callback(error);
    }
  });

  socket.on("user-space-connect", async (data, callback) => {
    try {
      const { username, uid, inviteCode } = data;
      const joinSpace = await space.addUserToSpace(inviteCode, username, uid);
      console.log(joinSpace.message);
      socket.join(inviteCode);
      io.to(inviteCode).emit("user-space-connected", {
        username,
        uid,
        inviteCode,
      });
    } catch (error) {
      callback(error);
    }
  });

  socket.on("user-space-disconnect", async (data, callback) => {
    try {
      const { username, uid, inviteCode } = data;
      const remove = await space.removeUserFromSpace(inviteCode, username, uid);
      console.log(remove);
      if (remove.status !== 200) return;
      socket.leave(inviteCode);
      //Notify client
      io.to(inviteCode).emit("user-space-disconnected", {
        username,
        inviteCode,
      });
    } catch (error) {
      console.log(error.message);
      callback(error);
    }
  });

  socket.on("user-space-owner-disconnect", async (data, callback) => {
    try {
      const { inviteCode, uid } = data;
      console.log(inviteCode);
      console.log("user leaving");
      //Notify client
      io.to(inviteCode).emit("user-space-owner-disconnected", {
        inviteCode,
      });
      //Remove the entire document from db
      const remove = await space.removeSpace(inviteCode);
      console.log(remove);
      //Remove user from room
      socket.leave(inviteCode);
    } catch (error) {
      console.log(error);
      callback(error);
    }
  });

  socket.on("spotify-space-queue", ({ uri, room }) => {
    console.log(uri, room);
    io.to(room).emit("add-to-queue", { uri });
  });

  socket.on("user-space-play", ({ uri, inviteCode }) => {
    console.log(uri, inviteCode);
    //Sync song to the clients
    io.to(inviteCode).emit("play", {
      uri,
    });
  });
});
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => console.log("Server is on on port: " + PORT));
