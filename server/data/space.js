const mongoCollections = require("../config/mongoCollections");
const space = mongoCollections.space;

const createSpace = async (spaceId, username, uid) => {
  let spaceCol = await space();
  const spaceRoom = {
    _id: spaceId,
    users: [
      {
        uid,
        username,
        isAdmin: true,
      },
    ],
  };
  const create = await spaceCol.insertOne(spaceRoom);

  if (create.insertedCount === 0) {
    throw new Error({ status: 404, message: "Error creating space" });
  }

  return { status: 200, message: `Space created with id: ${spaceId}` };
};

const addUserToSpace = async (spaceId, username, uid) => {
  let spaceCol = await space();
  const user = {
    uid,
    username,
  };

  const add = await spaceCol.updateOne(
    {
      _id: spaceId,
    },
    { $push: { users: user } }
  );

  console.log("Add : " + add.modifiedCount === 0);

  if (add.modifiedCount === 0)
    // eslint-disable-next-line no-throw-literal
    throw {
      status: 404,
      message: "Please check the invite code and try again",
    };

  return { status: 200, message: `Joined space with id: ${spaceId}` };
};

const removeUserFromSpace = async (spaceId, username, uid) => {
  let spaceCol = await space();
  const userToRemove = {
    uid,
    username,
  };
  console.log(userToRemove);
  const remove = await spaceCol.updateOne(
    {
      _id: spaceId,
    },
    { $pull: { users: { uid: userToRemove.uid } } }
  );

  console.log(remove);

  if (remove.modifiedCount === 0)
    // eslint-disable-next-line no-throw-literal
    throw { status: 404, message: "Error leaving space" };

  return { status: 200, message: `User left from space` };
};

module.exports = {
  createSpace,
  addUserToSpace,
  removeUserFromSpace,
};
