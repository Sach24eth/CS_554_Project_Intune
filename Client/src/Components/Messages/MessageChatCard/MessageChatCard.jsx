import React from "react";
import "./mCard.css";
const MessageChatCard = (props) => {
  const chatIcon =
    props.chat.title.split("")[0].toUpperCase() +
    props.chat.title.split("")[1].toUpperCase();
  return (
    <div className="chat-info-card">
      <div className="chat-icon">
        <span className="icon">{chatIcon}</span>
      </div>
      <h1 className="chat-title">{props.chat.title}</h1>
    </div>
  );
};

export default MessageChatCard;
