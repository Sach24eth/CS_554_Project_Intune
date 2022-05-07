import React, { useEffect, useState } from "react";
import { generateCode } from "../../../Services/generateCode";
import Spinner from "../../Spinner";

import "./welcome.css";
const Welcome = (props) => {
  const typography = [
    "Quality checks in progress",
    "Fueling spaceship...",
    "Ignition!",
    "Blast Off!!",
  ];

  const [create, setCreate] = useState(false);
  const [typo, setTypo] = useState(undefined);

  const createSpace = () => {
    const length = typography.length;
    let index = 0;
    setTypo(typography[index]);
    setCreate(true);
    console.log(props.socket);
    const typoInterval = setInterval(() => {
      index += 1;
      if (index >= length) {
        console.log("hey");
        clearInterval(typoInterval);
        setCreate(false);
        props.onCreated();
      }
      setTypo(typography[index]);
    }, 2000);

    const inviteCode = generateCode();
    window.localStorage.setItem("code", inviteCode);
    props.socket.emit("user-space-create", {
      username: props.user.displayName,
      uid: props.user.uid,
      inviteCode,
    });
  };
  return (
    <div className="welcomeModal">
      <div className="welc_msg_header">
        <span className="top">Welcome to</span>
        <span className="space">Spotify Space</span>
      </div>
      <div className="faq">
        <p>
          A place to chill, relax and enjoy your favorite songs with your
          friends.
          <br /> Add up-to 6 Spotify Premium users.
        </p>
      </div>
      <div className="get-started" onClick={createSpace}>
        {create ? (
          <div className="row">
            <Spinner />
            <span className="typo" key={typo}>
              {typo}
            </span>
          </div>
        ) : (
          <p className="btn-start">Understood, create my space!</p>
        )}
      </div>
    </div>
  );
};

export default Welcome;
