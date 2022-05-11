const cors = require("cors");
const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const spotifyWebApi = require("spotify-web-api-node");
var cookieParser = require("cookie-parser");
const data = require("./data");
const space = data.space;

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

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      // Returning the User's AccessToken in the json formate
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

  credentials.refreshToken = refreshToken;
  const spotifyApi = new spotifyWebApi(credentials);

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      console.log("Data is here");
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => res.status(400).json({ err: err }));
});

app.post("/me", async (req, res) => {
  credentials.accessToken = req.body.access_token;
  let spotifyApi = new spotifyWebApi(credentials);

  spotifyApi
    .getMe()
    .then((data) => {
      console.log(data);
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

  socket.on("user-space-create", async (data, callback) => {
    //Add user into db first
    try {
      const { username, uid, inviteCode } = data;
      const createSpace = await space.createSpace(inviteCode, username, uid);
      //Join the socket room
      socket.join(inviteCode);
    } catch (error) {
      callback(error);
    }
    //Notify the client
    // io.to(inviteCode).emit("user-space-connected", { username, inviteCode });
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
    const { username, uid, inviteCode } = data;
    //Remove user from the socket db collection

    console.log(username, uid, inviteCode);
    try {
      const remove = await space.removeUserFromSpace(inviteCode, username, uid);
      if (remove.status !== 200) return;
      //Remove user from room
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

  socket.on("user-space-owner-disconnect", ({ inviteCode, uid }) => {
    //Remove the entire document from db
    //Remove users from room
    socket.leave(inviteCode);
    //Notify client
    io.to(inviteCode).emit("user-space-owner-disconnected", {
      inviteCode,
    });
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
