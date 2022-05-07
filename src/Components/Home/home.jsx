import React, { useEffect, useState } from "react";
import "./home.css";
import Messages from "../Messages";
import SpotifyHome from "../SpotifyHome";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const auth = getAuth();
  const [greeting, setGreeting] = useState(undefined);
  const [username, setUsername] = useState(undefined);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const history = useNavigate();
  const refreshToken = window.localStorage.getItem("refresh_token") || null;
  const expiresIn = window.localStorage.getItem("expires_in") || null;

  let date = new Date();
  let currentTS = date.getTime();
  let accessTokenCreatedTime = window.localStorage.getItem(
    "accessTokenCreatedTime"
  );

  useEffect(() => {
    const authLocalStorage = parseInt(
      window.localStorage.getItem("authentication")
    );

    if (authLocalStorage === 0) {
      history("/auth/login");
    }
  }, []);

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

  if (refreshToken) getAccessToken(refreshToken);

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
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoadingAuth(false);
        console.log("usernamee", user);
      }
    });
    //Temp store username
    let userDetails = JSON.parse(window.localStorage.getItem("userDetails"));
    setUsername(userDetails?.displayName || "User");
  }, [auth]);

  return (
    <section id="home">
      <div className="grid">
        <div className="left">
          <SpotifyHome greeting={greeting} username={username} />
        </div>
        <div className="right">
          <Messages />
        </div>
        {/* <Player /> */}
      </div>
    </section>
  );
};

export default Home;
