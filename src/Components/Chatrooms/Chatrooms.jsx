import React, { useEffect, useRef, useState, } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./Chatrooms.css";
import axios from "axios";
const TOKEN = window.localStorage.getItem("token");
//console.log(TOKEN);
const URL = "https://api.spotify.com/v1";

let socket;
function ChatroomMaker() {
  const auth = getAuth();
  let scrollRef = useRef();
  //console.log(auth)
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const roomnumber = urlParams.get("room");
  //console.log("Htting the route chatrooms", roomnumber);
  //
  const rooms = [];
  const [room, setRoom] = useState();
  const [usrData, setUsrData] = useState();
  // const [genres, setGenres] = useState([]);
  const [state, setState] = useState({ message: "", uid:"",name: "",});
  const [chat, setChat] = useState([]);

  //Server setup
  useEffect(() => {
    socket = io(process.env.REACT_APP_API_URL);
    console.log("Socket:", socket)
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
              if (genreList.includes(roomnumber.toLowerCase())) {
                console.log("Set room:",roomnumber)
                setRoom(roomnumber);
              }
            })
        .catch((err) => console.log(err.response));
        onAuthStateChanged(auth, (user) => {
          if (user.uid || user) {
            console.log("Set user data:", user.displayName, roomnumber);
            setUsrData(user.displayName)
            setState({ name: user.displayName,userId: user.uid,room: roomnumber})
            console.log("Display statements")
            userjoin(user.displayName,user.uid,roomnumber)
            // userjoin(user.displayName,roomnumber);
          }
        });
    }
    getGenre();
    // console.log("UsrData: ", usrData)
    // console.log("Room", room)
    return () => {
      socket.disconnect();
    };
  }, [auth,roomnumber]);
  
  const userjoin = (name,uid,room) => {
    if (name !== undefined ||name) {
      console.log("defined:",name);
      socket.emit("user_join", { name,uid, room });
      return () => {
        //socketRef.current.off("receiveMsg");
        socket.off("receiveMsg");
      };
    }
  };
  useEffect(() => {
    // console.log("scroll effects")
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);
  // Use effect for setting chat status
  useEffect(() => {
    socket.on("message", ({ name,uid, message, room }) => {
      setChat((chat) => [...chat, { name,uid, message, room }]);
    });
    return () => {
      socket.off("receiveMsg");
    };
  }, []);

  useEffect(() => {
    //console.log("is this firing")
    socket.on("user_join", function (data) {
      console.log("user_join",data)
      setChat((chat) => [
        ...chat,
        {
          name: "SpotBot",
          message: `${data.name} has joined the chat`,
          room: data.room,
        },
      ]);
      console.log("Chat stuff", chat)
    });
  },[])
  //console.log("Chat:", chat);
  // console.log("state outside:", state)
  // console.log("Room:", room);

  const onMessageSubmit = (e) => {
    let msgEle = document.getElementById("message");
    console.log([msgEle.name], msgEle.value);
    if (msgEle.value === undefined || msgEle.value.trim() === '') {
      console.log("msgEle.value", msgEle.value)
      //alert("Message is empty!")
    } 
    else {
      setState({ ...state, [msgEle.name]: msgEle.value });
      //socketRef.current
      console.log('state name', state.name, "message elem: ", msgEle.value, "room:", room)
      socket.emit("message", {
        name: state.name,
        uid:state.userId,
        message: msgEle.value,
        room: room,
      });
    }
    e.preventDefault();
    setState({ message: msgEle.value, name: state.name });
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
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  //console.log(room);
  return (
    <div>
      <h1>Current room: {room}</h1>
      {/* {state.name && ( */}
      <div id="cardChat">
        <h1>Chat Log</h1>
          <div id="render-chat">
            {renderChat()}
          </div>
          <form id="messageSubmit" onSubmit={onMessageSubmit}>
            <div>
              <input
              name="message"
              placeholder="Say 'hi!'"
              id="message"
              variant="outlined"
              label="Message"
              />
            </div>
            <button id="msgBtn" >Send Message</button>
          </form>
        </div>
      {/* )} */}
    </div>
  );
}

export default ChatroomMaker;
