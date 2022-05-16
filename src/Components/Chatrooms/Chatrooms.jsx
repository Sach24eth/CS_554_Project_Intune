import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import Spinner from "../Spinner";
import "./Chatrooms.css";
import { toast, ToastContainer } from "react-toastify";
const Firestore = require("../../Firebase/Firestore");
//console.log(TOKEN);
const URL = "https://api.spotify.com/v1";

let socket;
function ChatroomMaker() {
  const auth = getAuth();
  const history = useNavigate();
  let scrollRef = useRef();
  //console.log(auth)
  const TOKEN = window.localStorage.getItem("token");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const roomnumber = urlParams.get("room");
  //console.log("Htting the route chatrooms", roomnumber);
  //
  const rooms = [];
  const [room, setRoom] = useState();
  const [usrData, setUsrData] = useState();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [state, setState] = useState({ message: "", uid: "", name: "" });
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const authLocalStorage = parseInt(
      window.localStorage.getItem("authentication")
    );

    if (authLocalStorage === 0) {
      history("/auth/login");
    }

    return;
  }, []);
  let socketFlag = false;
  //Server setup
  useEffect(() => {
    socket = io(process.env.REACT_APP_API_URL);
    console.log("Socket:", socket);
    async function getGenre() {
      //let id = null;
      await axios
        .get(URL + "/recommendations/available-genre-seeds", {
          headers: {
            Authorization: "Bearer " + TOKEN,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log("Setting rooms and doing genre check");
          let genreList = res.data.genres;
          console.log(genreList);
          setGenres(genreList);
          if (genreList.includes(roomnumber.toLowerCase())) {
            console.log("Set room:", roomnumber);
            setRoom(roomnumber);
          }
        })
        .catch((err) => {
          toast.error(err.message);
          return;
        });

      onAuthStateChanged(auth, (user) => {
        if (user.uid || user) {
          console.log("Set user data:", user.displayName, roomnumber);
          setUsrData(user.displayName);
          console.log("Setting UID:", user.uid);
          setState({ name: user.displayName, uid: user.uid, room: roomnumber });
          console.log("Display statements");
          userjoin(user.displayName, user.uid, roomnumber);
          // userjoin(user.displayName,roomnumber);
        } else {
          setError(true);
          console.log("Error");
        }
      });
    }
    getGenre();
    // console.log("UsrData: ", usrData)
    // console.log("Room", room)
    return () => {
      socket.disconnect();
    };
  }, [auth, roomnumber,TOKEN ]);

  useEffect(() => {
    console.log("chat history Triggers");
    async function getHistory() {
      console.log("fetch start!", room);
      if (room !== undefined) {
        console.log("Room check:", room);
        setLoading(false);
        await axios
          .get(`${process.env.REACT_APP_API_URL}chatHistory/${room}`)
          .then((res) => {
            let msgs = res.data.chatHistory.msg;
            console.log("chatHistory", msgs);
            for (let i = 0; i < msgs.length; i++) {
              let tempName = msgs[i].userName;
              let tempUid = msgs[i].userId;
              let tempMessage = msgs[i].messageText;
              let tempRoom = room;
              console.log("Message:", tempName, tempMessage, tempRoom);
              setChat((prev) => [
                ...prev,
                {
                  name: tempName,
                  message: tempMessage,
                  room: tempRoom,
                },
              ]);
            }
          })
          .catch((e) => console.log(e));
        //setError(true)
      }
    }
    getHistory();
  }, [room]);

  const userjoin = (name, uid, room) => {
    if (name !== undefined || name || !uid || !room) {
      console.log("defined:", name, uid, room);
      socket.emit("user_join", { name, uid, room });
      return () => {
        //socketRef.current.off("receiveMsg");
        socket.off("receiveMsg");
      };
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    // console.log("scroll effects")
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);
  // Use effect for setting chat status
  useEffect(() => {
    socket.on("message", ({ name, uid, message, room }) => {
      setChat((chat) => [...chat, { name, uid, message, room }]);
    });
    return () => {
      socket.off("receiveMsg");
    };
  }, []);

  useEffect(() => {
    //console.log("is this firing")
    socket.on("user_join", function (data) {
      console.log("user_join", data);
      Firestore.addGenreToList(data.room);
      setLoading(false);
      setChat((chat) => [
        ...chat,
        {
          name: "SpotBot",
          message: `${data.name} has joined the chat`,
          room: data.room,
        },
      ]);
      console.log("Chat stuff", chat);
    });
  }, []);
  //console.log("Chat:", chat);
  //console.log("state outside:", state)
  // console.log("Room:", room);

  const onMessageSubmit = (e) => {
    let msgEle = document.getElementById("message");
    console.log([msgEle.name], msgEle.value);
    if (msgEle.value === undefined || msgEle.value.trim() === "") {
      console.log("msgEle.value", msgEle.value);
      //alert("Message is empty!")
    } else {
      setState({ ...state, message: msgEle.value });
      //socketRef.current
      console.log(
        "state name",
        state.name,
        "state.uid:",
        state.uid,
        "message elem: ",
        msgEle.value,
        "room:",
        room
      );
      socket.emit("message", {
        name: state.name,
        uid: state.uid,
        message: msgEle.value,
        room: room,
      });
    }
    e.preventDefault();
    setState({ message: msgEle.value, name: state.name, uid: state.uid });
    msgEle.value = "";
    msgEle.focus();
    return () => {
      socket.off("receiveMsg");
    };
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div ref={scrollRef} key={index}>
        <h3>
          <span className="chat-user">{name}</span> : {message}
        </h3>
      </div>
    ));
  };
  const leaveRoom = async () => {
    console.log("leaving..");
    //console.log("args",state);
    await Firestore.removeGenreFromList(room);
    socket.emit("room-disconnect", { uid: state.uid, room: room });
    socket.disconnect();
    history(`/messages`);
  };

  if (error === true) {
    return (
      <div>
        <h1>Oops something went wrong!</h1>
      </div>
    );
  }

  return (
    <section id="chatroom">
      <div className="container">
        <ToastContainer aria-label="Toast" />
        <div className="header">
          <h1 className="title" id="chatTitle">
            {room}
          </h1>
          <button className="leave" id="leaveBtn" onClick={leaveRoom}>
            Leave Room
          </button>
        </div>
        <div className="cardChat">
          <div className="top">
            <div id="render-chat">{loading ? <Spinner /> : renderChat()}</div>
          </div>
          <div className="bottom">
            <form id="messageSubmit" onSubmit={onMessageSubmit}>
              <label>
                <input
                  name="message"
                  placeholder="Say 'hi!'"
                  id="message"
                  variant="outlined"
                  label="Message"
                />
              </label>
              <button id="msgBtn">Send</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ChatroomMaker;
