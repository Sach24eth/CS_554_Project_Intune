import Chatrooms from "../../Chatrooms/Chatrooms"
import React,{ useEffect, useState } from "react";
import "./mCard.css";

const MessageChatCard = (props) => {
  //const [room,setRoom]=useState(false)
  console.log("chat prop:", props.chat)
  console.log("username:", props.userName)
  //console.log("GenreData:", props.allGenres)
  const chatIcon =
    props.chat.title.split("")[0].toUpperCase() +
    props.chat.title.split("")[1].toUpperCase();
    const handleNavigation = () => {
      console.log("Window open!!")
      //setRoom(true)
      window.open(`http://localhost:3000/chatrooms?room=${props.chat.title}`)
    }
  return (
    <div className="chat-info-card" onClick={() => handleNavigation()}>
      <div className="chat-icon">
        <span className="icon">{chatIcon}</span>
      </div>
      <h1 className="chat-title">{props.chat.title}</h1>
    </div>
  );
};

export default MessageChatCard;
