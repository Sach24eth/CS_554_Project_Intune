import React, { useEffect, useState } from "react";
import MessageChatCard from "./MessageChatCard/MessageChatCard";
import "./message.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const firestore = require("../../Firebase/Firestore");
const Firebase = require("../../Firebase/Firebase");

const TOKEN = window.localStorage.getItem("token");
//console.log(TOKEN);
const URL = "https://api.spotify.com/v1";
const Messages = () => {
  const auth = getAuth();
  const history = useNavigate();
  let tempMessagesRoom = [];
  const [usrData, setUsrData] = useState();
  const [usrgenres, setUsrGenres] = useState([]);
  //const [genres,setGenres]=useState([]);
  useEffect(() => {
    async function getGenre() {
      // const id =JSON.parse(window.localStorage.getItem("userDetails")).uid || null;
      // console.log(id)
      let id = null;
      onAuthStateChanged(auth,user => {
        if (user.uid || user) {
          //console.log("userData:", user.displayName);
          setUsrData(user.displayName);
          firestore
            .getGenreData(user.uid)
            .then((res) => {
              for (let i = 0; i < res.genres.length; i++) {
                tempMessagesRoom[i] = {id:i,title:res.genres[i]}
              }
              setUsrGenres(tempMessagesRoom);
              //console.log("Genre data",tempMessagesRoom);
              if (!res.hasData) history("/genres");
            })
            .catch((err) => console.log(err));
        }
      });
    }
    getGenre();
  }, []);
  //console.log("Outside: ", usrgenres)
  return (
    <div className="header">
      <h1>Messages</h1>
      <div className="search-chat">
        <label>
          <input
            type={"text"}
            placeholder="Search chatroom..."
            name="search-chat"
          />
        </label>
      </div>
      <br></br>
      <div className="messageContainer">
        {usrgenres.map((room, i) => {
          return <MessageChatCard key={i} chat={room} userName={usrData}/>;
        })}
      </div>
    </div>
  );
};

export default Messages;
