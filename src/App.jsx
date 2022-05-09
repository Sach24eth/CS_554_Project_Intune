import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import generateToken from "./Services/generateToken";
import GenrePicker from "./Components/GenrePicker";
import Navbar from "./Components/Navigation";
import Home from "./Components/Home";
import Library from "./Components/Library";
import User from "./Components/User/User";
import Callback from "./Components/CallbackHandler/Callback";
import ChatRoom from "./Components/Chatrooms/Chatrooms";
import PlaylistPage from "./Pages/Playlist";
import AlbumPage from "./Pages/Album";
import LikedSongsPage from "./Pages/LikedSongs";
import LandingPage from "./Pages/Landing";
import SearchPage from "./Pages/Search";
import Auth from "./Pages/Auth";
import Player from "./Components/Player";
import SpacePage from "./Pages/Space";
import Artist from "./Components/Artist";
import ChangePassword from "./Components/User/ForgotPassword";
import { useDispatch } from "react-redux";
import { authLogin } from "./Redux/Actions/Auth";
import { updateSpotifyPlayerState } from "./Redux/Actions/Player";
import "./app.css";

const App = () => {
  const [auth, setAuth] = useState(false);
  const dispatch = useDispatch();
  const [connection, setConnection] = useState(false);
  const [hidePlayer, setHidePlayer] = useState(false);

  const connectionToSpotify = (state) => {
    setConnection((connectionState) => state);
  };

  const hideSpotifyPlayer = () => {
    setHidePlayer((prev) => !prev);
  };

  useEffect(() => {
    const userDetails = JSON.parse(window.localStorage.getItem("userDetails"));
    const hasAccessToken = window.localStorage.getItem("access_token");
    if (userDetails) {
      dispatch(
        authLogin(
          userDetails.uid,
          userDetails.displayName,
          userDetails.email,
          userDetails.lastLoginAt
        )
      );
    }

    if (hasAccessToken) {
      updateSpotifyPlayerState(true);
      connectionToSpotify(true);
    } else {
      updateSpotifyPlayerState(false);
      connectionToSpotify(false);
    }
  }, [dispatch]);

  //Sets auth state based on local storage to keep user logged in
  useEffect(() => {
    const authLocalStorage = parseInt(
      window.localStorage.getItem("authentication")
    );

    if (authLocalStorage === 1) {
      setAuth((prev) => true);
    } else setAuth((prev) => false);
  }, []);

  //Toggle for auth state upon login
  const onLogin = (e) => {
    setAuth((prev) => true);
  };

  //Toggle for auth state upon logout
  const onLogout = (e) => {
    setAuth((prev) => false);
  };

  //Token
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
      Number(currentTime) - Number(creationTime) >
        Number(3600 * 1000) - 10000 ||
      !window.localStorage.getItem("token")
    )
      getToken();
  }, []);

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
          <Route
            path="/me"
            element={<User connection={connectionToSpotify} />}
          />
          <Route path="/callback" element={<Callback />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/album" element={<AlbumPage />} />
          <Route
            path="/space"
            element={
              <SpacePage hide={hideSpotifyPlayer} hideStatus={hidePlayer} />
            }
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/artist" element={<Artist />} />
          <Route path="/liked-songs" element={<LikedSongsPage />} />
          <Route path="/me/forgot-password" element={<ChangePassword />} />
          <Route path="/liked-songs" element={<LikedSongsPage />} />
          <Route path="/album" element={<AlbumPage />} />
          <Route path="/chatrooms" element={<ChatRoom />} />
        </Routes>
        {hidePlayer ? (
          <Player connection={connection} hide={hidePlayer} />
        ) : (
          <Player connection={connection} />
        )}
      </Router>
    </>
  );
};

export default App;
