import React, { useEffect, useState } from "react";
import "./home.css";
import Messages from "../Messages";
import SpotifyHome from "../SpotifyHome";
import axios from "axios";
import {
  FaBackward,
  FaPlay,
  FaForward,
  FaVolumeUp,
  FaHeart,
  FaMicrophone,
  FaExpand,
  FaEllipsisV,
} from "react-icons/fa";

const Home = () => {
  const [greeting, setGreeting] = useState(undefined);
  const [username, setUsername] = useState(undefined);

  const refreshToken = window.localStorage.getItem("refresh_token") || null;
  const expiresIn = window.localStorage.getItem("expires_in") || null;

  let date = new Date();
  let currentTS = date.getTime();
  let accessTokenCreatedTime = window.localStorage.getItem(
    "accessTokenCreatedTime"
  );

  const getAccessToken = (refreshToken) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/refresh`, { refreshToken })
      .then((res) => {
        console.log("Token refreshed and set.");
        window.localStorage.setItem("access_token", res.data.accessToken);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  if (Number(currentTS - accessTokenCreatedTime) > 3600 * 1000 && refreshToken)
    getAccessToken(refreshToken);

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const internval = setInterval(() => {
      console.log("Refreshed...");
      getAccessToken(refreshToken);
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(internval);
  }, [refreshToken, expiresIn]);

  useEffect(() => {
    const date = new Date();
    const hr = date.getHours();
    if (hr < 12) {
      setGreeting("Good Morning");
    } else if (hr > 12 && hr < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    //Temp store username
    setUsername("Tejas");
  }, []);

  return (
    <section id="home">
      <div className="grid">
        <div className="left">
          <SpotifyHome greeting={greeting} username={username} />
        </div>
        <div className="right">
          <Messages />
        </div>
        <div className="bottom-player">
          <div className="track-img">
            <img
              src="https://i.scdn.co/image/ab67616d00001e02c50ee26def224e163f54ae0c"
              alt="track"
            />
            <div className="track-name">
              <p className="song">Hurricane (Arcano Remix)</p>
              <p className="artistName">
                Cheat Codes, Grey, Tyson Ritter, Arcando
              </p>
            </div>
            <FaHeart className="heart icon" />
          </div>
          <div className="controls">
            <div className="icons">
              <FaBackward className="icon" />
              <FaPlay className="white icon" />
              <FaForward className="icon" />
            </div>
            <div className="slider">
              <p className="time-playing font-sm">0:54</p>
              <p className="slider-control">
                <span className="slider-actual-pointer"></span>
              </p>
              <p className="time-total font-sm">4:00</p>
            </div>
          </div>
          <div className="volume">
            <FaVolumeUp className="icon" />
            <FaMicrophone className="icon" />
            <FaExpand className="icon" />
            <FaEllipsisV className="icon" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
