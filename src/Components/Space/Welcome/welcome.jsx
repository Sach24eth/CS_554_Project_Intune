import React, { useState } from "react";
import Spinner from "../../Spinner";
import { toast, ToastContainer } from "react-toastify";
import { generateCode } from "../../../Services/generateCode";
import { GrFormClose } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setInviteCode } from "../../../Redux/Actions/Space";
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
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState(undefined);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setModalState = () => {
    setShowModal((prev) => !prev);
  };

  const onCodeChange = (e) => {
    setCode(e.target.value);
  };

  const onJoin = (e) => {
    if (!code) return toast.error("Code cannot be empty");

    dispatch(setInviteCode(code));
    setModalState();
    props.joiningViaInvite(true);
    props.setSpaceOwner(false);
    navigate(`/space?inviteCode=${code}`);
  };

  const createSpace = () => {
    if (!props.playerState)
      return toast.error("Connect to Spotify to start Space");
    const length = typography.length;
    props.setSpaceOwner(true);
    let index = 0;
    setTypo(typography[index]);
    setCreate(true);
    const typoInterval = setInterval(() => {
      index += 1;
      if (index >= length) {
        clearInterval(typoInterval);
        setCreate(false);
        props.onCreated(true);
      }
      setTypo(typography[index]);
    }, 2000);

    const inviteCode = generateCode();
    dispatch(setInviteCode(inviteCode));
    window.localStorage.setItem("code", inviteCode);
    props.socket.emit(
      "user-space-create",
      {
        username: props.user.displayName,
        uid: props.user.uid,
        inviteCode,
      },
      (err) => {
        toast.error(err.message);
        return;
      }
    );
  };
  return (
    <>
      {showModal && (
        <div className="joinModal" id="join-modal">
          <div className="container">
            <div className="close-btn" onClick={setModalState}>
              <GrFormClose size={30} className="whiteIcon" />
            </div>
            <div className="header">Join Space</div>
            <div className="input">
              <label>
                <input
                  type="text"
                  placeholder="Enter code here"
                  onChange={onCodeChange}
                />
              </label>
              <div className="join" onClick={onJoin}>
                Join Space 🚀
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="welcomeModal">
        <ToastContainer theme="dark" />
        <div className="welc_msg_header">
          <span className="top">Welcome to</span>
          <span className="space">Spotify Space</span>
        </div>
        <div className="faq">
          <p>
            A place to chill, relax and enjoy your favorite songs with your
            friends.
            {/* <br /> Add up-to 6 Spotify Premium users. */}
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
        <div className="join-space" onClick={setModalState}>
          Have a code? Join space now!
        </div>
      </div>
    </>
  );
};

export default Welcome;
