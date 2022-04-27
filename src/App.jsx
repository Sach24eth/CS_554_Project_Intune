import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import generateToken from "./Services/generateToken";
import "./app.css";
import GenrePicker from "./Components/GenrePicker";
import Navbar from "./Components/Navigation";
import Home from "./Components/Home";
import Library from "./Components/Library";
import User from "./Components/User/User";
import Callback from "./Components/CallbackHandler/Callback";
import PlaylistPage from "./Pages/Playlist";
import Playback from "./Components/Player_Test/Player";
import LandingPage from "./Pages/Landing";
import Auth from "./Pages/Auth";

const App = () => {
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    const authLocalStorage = parseInt(
      window.localStorage.getItem("authentication")
    );

    if (authLocalStorage === 1) {
      setAuth((prev) => true);
    } else setAuth((prev) => false);
  }, []);
  const onLogin = (e) => {
    setAuth((prev) => true);
  };

  const onLogout = (e) => {
    setAuth((prev) => false);
  };

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
      Number(currentTime) - Number(creationTime) > Number(3600 * 1000) - 1000 ||
      !window.localStorage.getItem("token")
    )
      getToken();
  }, []);

  // const auth = window.localStorage.getItem("auth") === "1" ? true : false;
  const username =
    JSON.parse(window.localStorage.getItem("userDetails"))?.displayName ||
    "User";
  return (
    <>
      <Router>
        <Navbar auth={auth} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth/:authType"
            element={<Auth onLogin={onLogin} onLogout={onLogout} />}
          />
          <Route path="/home" element={<Home />} />
          <Route path="/genres" element={<GenrePicker />} />
          <Route path="/library" element={<Library />} />
          <Route path="/me" element={<User />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/album" element={<PlaylistPage />} />
          <Route
            path="/player"
            element={<Playback uri={"spotify:track:4lmAXtOr6m1WFNQ6ssjdht"} />}
          />
        </Routes>
        {/* {auth && <Playback uri={"spotify:track:4lmAXtOr6m1WFNQ6ssjdht"} />} */}
      </Router>
    </>
  );
};

export default App;
