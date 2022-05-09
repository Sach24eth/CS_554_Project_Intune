import React, { useState, useEffect } from "react";
import Welcome from "./Welcome/welcome";
import { io } from "socket.io-client";
import "./space.css";
import Spaceship from "./Spaceship";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "../Spinner";

let socket = null;
let attempts = 0;
let maxConnectionAttempts = 5;
const Space = ({ hide, hideStatus }) => {
  const [spaceCreated, setSpaceCreated] = useState(false);
  const user = JSON.parse(window.localStorage.getItem("userDetails"));
  const [spaceOwner, setSpaceOwner] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const playerState =
    JSON.parse(window?.localStorage?.getItem("user"))?.accountType ===
      "premium" || false;

  const inviteCode = new URLSearchParams(window.location.search).get(
    "inviteCode"
  );

  useEffect(() => {
    if (!playerState) return toast.error("Connect to Spotify to start Space");
    let connectionAttempt;
    let socketConnected = false;
    const socketConnection = async () => {
      if (!socket) socket = io(process.env.REACT_APP_API_URL);

      socket.on("connect", () => {
        console.log(socket.id);
        if (socket.id) {
          socketConnected = true;
          if (inviteCode) joinSpace();
          setLoading(false);
        }
      });

      if (!socketConnected && !error) {
        if (attempts === maxConnectionAttempts) {
          clearInterval(connectionAttempt);
          setError("Unable to establish socket connection.");
        }
        connectionAttempt = setInterval(async () => {
          attempts++;
          socket = io(process.env.REACT_APP_API_URL);
          socket.on("connect", () => {
            if (socket.id) socketConnected = true;
          });

          if (socketConnected) {
            clearInterval(connectionAttempt);
            console.log("Connection Established");
            setError(undefined);
            setLoading(false);
          }

          if (attempts >= maxConnectionAttempts) {
            clearInterval(connectionAttempt);
            setError("Unable to establish socket connection.");
            setLoading(false);
          }
        }, 1000);
      }
    };

    socketConnection();
    return () => {
      hide(false);
      socket.disconnect();
      clearInterval(connectionAttempt);
    };
  }, []);

  const joinSpace = () => {
    if (!playerState) return toast.error("Connect to Spotify to start Space");
    socket.emit("user-space-connect", {
      username: user.displayName,
      uid: user.uid,
      inviteCode,
    });
    setSpaceOwner(false);
    console.log("joining space: " + inviteCode);
    //Join the room
    created();
  };

  const created = () => {
    hide(true);
    setSpaceCreated(true);
  };

  if (loading) {
    return (
      <section id="space">
        <div className="container">
          <div className="loader">
            <Spinner />
            <h1>Establishing socket connection. Please wait...</h1>
          </div>
        </div>
      </section>
    );
  } else if (error) {
    return <h1>{error}</h1>;
  } else
    return (
      <section id="space">
        <ToastContainer />
        {!spaceCreated && (
          <Welcome
            socket={socket}
            user={user}
            className="container"
            onCreated={created}
            setSpaceOwner={setSpaceOwner}
            playerState={playerState}
          />
        )}
        {spaceCreated && (
          <Spaceship
            socket={socket}
            hideStatus={hideStatus}
            spaceOwner={spaceOwner}
          />
        )}
        {/* <div>Test</div> */}
      </section>
    );
};

export default Space;
