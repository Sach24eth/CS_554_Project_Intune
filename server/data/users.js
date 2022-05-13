const mongoCollections = require("../config/mongoCollections");
const userCollection = mongoCollections.users;
const chatroomCollection = mongoCollections.chatroom;

const addUser = async (uid) => {
  if (!uid || uid.trim().length === 0)
    throw { status: 400, msg: "Uid needs to defined!" };
  const users = await userCollection();
  const userObj = {
    userId: uid,
    rooms: [],
  };
  const findUsr = await users.findOne({ userId: uid });
  if (!findUsr || findUsr === undefined) {
    const insertUsr = await users.insertOne(userObj);
    if (insertUsr.modifiedCount === 0)
      throw { status: 500, msg: "Could not add any user" };
    return { status: 200, msg: "user added" };
  } else {
    throw { status: 200, msg: "User already exists!" };
  }
};
const addRoomWithMsg = async (uid, room) => {
  if (!uid || uid.trim().length === 0)
    throw { status: 400, msg: "Uid needs to defined!" };
  if (!room || room.trim().length === 0)
    throw { status: 400, msg: "Room needs to defined!" };
  const users = await userCollection();
  const chatroom = await chatroomCollection();
  const roomExist = await chatroom.findOne({ roomName: room });
  const findUsr = await users.findOne({ userId: uid });
  console.log("User flag:", findUsr, "chatroom flag", roomExist);
  if (findUsr && roomExist) {
    const usrFindRoom = await users.findOne({ userId: uid, rooms: room });
    if (!usrFindRoom || usrFindRoom === undefined) {
      const insertRoom = await users.updateOne(
        { userId: uid },
        { $push: { rooms: room } }
      );
      if (insertRoom.modifiedCount === 0)
        throw { status: 500, msg: "Could not add any room to user db" };
      return { status: 200, msg: "user added" };
    } else {
      throw { status: 200, msg: "Room has already been added to user DB" };
    }
  } else {
    throw { status: 500, msg: "User does not exist!" };
  }
};

const delRoomwithMessage = async (uid, room) => {
  if (!uid || uid.trim().length === 0)
    throw { status: 400, msg: "Uid needs to defined!" };
  if (!room || room.trim().length === 0)
    throw { status: 400, msg: "Room needs to defined!" };
  const users = await userCollection();
  const removeRoom = await users.updateOne(
    { userId: uid },
    { $pull: { rooms: room } }
  );
  console.log("userRemoved:");

  if (removeRoom.modifiedCount === 0)
    throw new Error({ status: 404, message: "User was not removed!" });

  return { status: 200, message: `User has left ${room} chatroom` };
};
module.exports = {
  addUser,
  addRoomWithMsg,
  delRoomwithMessage,
};
