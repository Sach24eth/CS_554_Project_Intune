import React, { useState, useEffect } from "react";
import Welcome from "./Welcome/welcome";
import { io } from "socket.io-client";
import "./space.css";
import Spaceship from "./Spaceship";

let socket;

const Space = ({ hide, hideStatus }) => {
  const [spaceCreated, setSpaceCreated] = useState(false);
  const user = JSON.parse(window.localStorage.getItem("userDetails"));

  const [isCreating, setIsCreating] = useState(undefined);
  const [player, setPlayer] = useState(undefined);
  const inviteCode = new URLSearchParams(window.location.search).get(
    "inviteCode"
  );

  useEffect(() => {
    socket = io(process.env.REACT_APP_SOCKET_URL);
    // let playerRef = document.getElementsByClassName("bottom-player");
    // setPlayer((prev) => playerRef);
    console.log(player);
    if (socket && inviteCode) joinSpace();
    return () => {
      hide();
      socket.disconnect();
    };
  }, []);
  console.log(socket);

  const joinSpace = () => {
    setIsCreating(false);
    // const player = document.getElementsByClassName("bottom-player");
    // console.log(player[0]);

    socket.emit("user-space-connect", {
      username: user.displayName,
      uid: user.uid,
      inviteCode,
    });
    hide();
    created();

    console.log("joining space: " + inviteCode);

    //Join the room
  };

  const created = () => {
    setSpaceCreated(true);
  };
  return (
    <section id="space">
      {!spaceCreated && (
        <Welcome
          socket={socket}
          user={user}
          className="container"
          onCreated={created}
        />
      )}
      {spaceCreated && <Spaceship socket={socket} hideStatus={hideStatus} />}
      {/* <div>Test</div> */}
    </section>
  );
};

export default Space;
