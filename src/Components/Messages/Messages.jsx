import React from "react";
import MessageChatCard from "./MessageChatCard/MessageChatCard";
import "./message.css";

const Messages = () => {
  const tempMessagesRoom = [
    {
      id: Math.round(Math.random() * 10000000),
      title: "Pop",
    },
    {
      id: Math.round(Math.random() * 10000000),
      title: "EDM",
    },
    {
      id: Math.round(Math.random() * 10000000),
      title: "Electro",
    },
    {
      id: Math.round(Math.random() * 10000000),
      title: "Chill",
    },
  ];
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
        {tempMessagesRoom.map((room, i) => {
          return <MessageChatCard key={i} chat={room} />;
        })}
      </div>
    </div>
  );
};

export default Messages;
