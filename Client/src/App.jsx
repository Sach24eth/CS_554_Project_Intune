import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import generateToken from "./Services/generateToken";
import "./app.css";
import GenrePicker from "./Components/GenrePicker";
import Navbar from "./Components/Navigation";
import Home from "./Components/Home";
import Library from "./Components/Library";
import User from "./Components/User/User";
import Callback from "./Components/CallbackHandler/Callback";
import Chatrooms from "./Components/Chatrooms/ChatroomSockets"

const App = () => {
  useEffect(() => {
    let token = "";
    const date = new Date();
    const creationTime = window.localStorage.getItem("tokenSetTime");
    const currentTime = date.getTime();
    async function getToken() {
      token = await generateToken();
      const dTime = date.getTime();
      window.localStorage.setItem("token", token);
      window.localStorage.setItem("tokenSetTime", dTime);
    }
    if (
      currentTime - creationTime > Number(3600 * 1000) - 1000 ||
      !window.localStorage.getItem("token")
    )
      getToken();
  }, []);

  return (
    <>
      <Router>
        <Navbar auth={true} username={"Tejas"} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/genres" element={<GenrePicker />} />
          <Route path="/library" element={<Library />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/chatroom" element={<Chatrooms />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
