const express = require("express");
const router = express.Router();
const data = require("../data");
const chatroom = data.chatroom;
//let { ObjectId, ConnectionCheckedInEvent } = require("mongodb");

router.get("/:roomName", async (req, res) => {
  const room = req.params.roomName;
  console.log("route Room:", room);
  try {
    if (!room || room.length <= 0) throw error("Invalid room name");
    const chatHistory = await chatroom.fetchAllMessages(room);
    console.log("fetched Messages:", chatHistory.msg);
    return res.json({ chatHistory });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
