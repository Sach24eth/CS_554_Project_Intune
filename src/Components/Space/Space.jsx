import React, { useState, useEffect } from "react";
import Welcome from "./Welcome/welcome";
import { io } from "socket.io-client";
import "./space.css";
import Spaceship from "./Spaceship";
import { toast, ToastContainer } from "react-toastify";
import Spinner from "../Spinner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setInviteCode } from "../../Redux/Actions/Space";

let socket = null;
let attempts = 0;
let maxConnectionAttempts = 5;

const Space = ({ hide, hideStatus }) => {
  const [spaceCreated, setSpaceCreated] = useState(false);
  const user = JSON.parse(window.localStorage.getItem("userDetails"));
  const [spaceOwner, setSpaceOwner] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);
  const [joinErr, setJoinErr] = useState(false);
  const [joiningViaInvite, setJoiningViaInvite] = useState(false);
  const dispatch = useDispatch();
  const playerState =
    JSON.parse(window?.localStorage?.getItem("user"))?.accountType ===
      "premium" || false;

  let inviteCode =
    new URLSearchParams(window.location.search).get("inviteCode") ||
    window.localStorage.getItem("code");

  const history = useNavigate();

  useEffect(() => {
    if (!playerState) {
      setError("Connect to Spotify to start Space");
      setLoading(false);
      return toast.error("Connect to Spotify to start Space");
    }
    let connectionAttempt;
    let socketConnected = false;
    const socketConnection = async () => {
      if (!socket) socket = io(process.env.REACT_APP_API_URL);

      socket.on("connect", () => {
        if (socket.id) {
          socketConnected = true;
          if (inviteCode) joinSpace(inviteCode);
          setLoading(false);
        }
      });

      if (!socketConnected && !error) {
        if (attempts === maxConnectionAttempts) {
          clearInterval(connectionAttempt);
          setError("Unable to establish socket connection. Please Refresh.");
        }
        connectionAttempt = setInterval(async () => {
          attempts++;
          socket = io(process.env.REACT_APP_API_URL);
          socket.on("connect", () => {
            if (socket.id) socketConnected = true;
          });

          if (socketConnected) {
            clearInterval(connectionAttempt);
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
      const code = window.localStorage.getItem("code");
      socket.emit(
        "user-space-disconnect",
        {
          username: user.displayName,
          uid: user.uid,
          inviteCode: code,
        },
        (err) => {
          toast.error(err.message);
          return;
        }
      );

      window.localStorage.removeItem("code");
      socket.disconnect();
      clearInterval(connectionAttempt);
    };
  }, []);

  useEffect(() => {
    if (joiningViaInvite) {
      let code = new URLSearchParams(window.location.search).get("inviteCode");

      joinSpace(code);
    } else {
      created(false);
    }
  }, [joiningViaInvite]);

  const joinSpace = (code) => {
    if (!playerState) return toast.error("Connect to Spotify to start Space");

    dispatch(setInviteCode(code));
    socket.emit(
      "user-space-connect",
      {
        username: user.displayName,
        uid: user.uid,
        inviteCode: code,
      },
      (err) => {
        console.log(err);
        setJoinErr((prev) => true);
        history("/space");
        setJoiningViaInvite(false);
        return toast.error(err.message);
      }
    );
    if (!joinErr) {
      setSpaceOwner(false);
      created(true);
    }
  };

  const created = (value) => {
    hide(value);
    setSpaceCreated(value);
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
    return (
      <section id="space">
        <div className="container">
          <h1>{error}</h1>
        </div>
      </section>
    );
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
            joiningViaInvite={setJoiningViaInvite}
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
