import React, { useState, useEffect } from "react";
import Welcome from "./Welcome/welcome";
import { io } from "socket.io-client";
import "./space.css";
import Spaceship from "./Spaceship";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

let socket;

const Space = ({ hide, hideStatus }) => {
  const [spaceCreated, setSpaceCreated] = useState(false);
  const user = JSON.parse(window.localStorage.getItem("userDetails"));
  const [spaceOwner, setSpaceOwner] = useState(true);
  const playerState =
    JSON.parse(window?.localStorage?.getItem("user"))?.accountType ===
      "premium" || false;
  console.log(playerState);
  const inviteCode = new URLSearchParams(window.location.search).get(
    "inviteCode"
  );

  useEffect(() => {
    if (!playerState) return toast.error("Connect to Spotify to start Space");
    socket = io(process.env.REACT_APP_SOCKET_URL);

    if (socket && inviteCode) joinSpace();
    return () => {
      hide();
      socket.disconnect();
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
    hide();
    setSpaceCreated(true);
  };

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
