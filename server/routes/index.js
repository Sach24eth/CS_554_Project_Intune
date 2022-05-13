const chat = require("./chat");
const constructor = (app) => {
  app.use("/chatHistory", chat);
  app.use("/test", (req, res) => {
    res.send("test route");
  });
};

module.exports = constructor;
