const mongoCollections = require("../config/mongoCollections");
const chatroomCollection = mongoCollections.chatroom;

const createRooms = async (room) => {
  if (!room || room === null) {
    throw { status: 404, msg: "No genres found!" };
  }
  const chatroom = await chatroomCollection();
  for (let i = 0; i < room.length; i++) {
    if (room[i] === undefined || room[i].trim() === "") {
      throw { status: 400, msg: "RoomName is required" };
    }
    let roomName = room[i];

    const chatroomObj = {
      roomName,
      users: [],
      messages: [{}],
    };
    const addRoom = await chatroom.insertOne(chatroomObj);
    if (addRoom.insertCount == 0)
      throw { status: 500, msg: "Error creating room in db" };
  }
};
const addUsertoRoom = async (uid, room) => {
  if (!uid || !room) {
    throw { status: 400, msg: "RoomName is required" };
  }
  const chatroom = await chatroomCollection();
  const addUsr = await chatroom.updateOne(
    { roomName: room },
    { $push: { users: uid } }
  );
  if (addUsr.modifiedCount === 0)
    throw { status: 500, msg: "Could not add any user" };
  return { status: 200, msg: "user added" };
};
const addMessagesToRoom = async (name, uid, message, room) => {
  if (name === null || !uid || !message || !room) {
    throw { status: 400, msg: "RoomName is required" };
  }
  const chatroom = await chatroomCollection();
  const ts = new Date();
  const messageObj = {
    userId: uid,
    userName: name,
    messageText: message,
    timestamp: ts.toLocaleString(),
  };
  const addMsg = await chatroom.updateOne(
    { roomName: room },
    { $push: { messages: messageObj } }
  );
  if (addMsg.modifiedCount === 0)
    throw { status: 500, msg: "Could not add any messages" };
  return { status: 200, msg: "Messaged added" };
};

const fetchAllMessages = async (room) => {
  if (!room || !room.trim() === "")
    throw { status: 400, msg: "Roomname is required" };
  const chatroom = await chatroomCollection();
  const findRoom = await chatroom.findOne({ roomName: room });
  if (!findRoom) throw { status: 404, msg: "Room not found" };
  return { status: 200, msg: findRoom.messages };
};

const leaveChatroom = async (uidRemove, room) => {
  if (!uid || !room) throw { status: 400, msg: "Details of user required" };
  const chatroom = await chatroomCollection();
  const removeUsr = await chatroom.updateOne(
    { roomName: room },
    { $pull: { users: uidRemove } }
  );
  console.log("userRemoved:", removeUsr);

  if (removeUsr.modifiedCount === 0)
    throw new Error({ status: 404, message: "User was not removed!" });

  return { status: 200, message: `User has left ${room} chatroom` };
};
module.exports = {
  createRooms,
  addUsertoRoom,
  addMessagesToRoom,
  fetchAllMessages,
  leaveChatroom,
};
