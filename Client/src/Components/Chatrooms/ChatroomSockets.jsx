import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client"
import "./ChatroomSockets.css"

function ChatroomMaker() {
  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState([]);
  const rooms = ["Room 1", "Room 2", "Room 3"];
  const [room, setRoom] = useState(rooms[0]);

  const socketRef = useRef();

  useEffect(() => {
    //socketRef.current = io("ws://localhost:4000/");
    socketRef.current = io("/");
    console.log("hello server: ", socketRef.current)
    return () => {
      socketRef.current.disconnect();
    };
    
  }, []);

  useEffect(() => {
    console.log("Message start",socketRef.current);
      socketRef.current.on("message", ({ name, message, room }) => {
          console.log(`Setting Chat.... Name: ${name} Message: ${message} Room: ${room}`)
          setChat([...chat, { name, message, room }]);
    });
    socketRef.current.on("user_join", function (data) {
      console.log("usejroiN_join",data.name)
      setChat([
        ...chat,
        {
          name: "ChatBot",
          message: `${data.name} has joined the chat`,
          room: data.room,
        },
      ]);
    });
  }, [chat, room]);
  console.log("Chat:", chat);
  console.log("Room:", room);
  const userjoin = (name) => {
    socketRef.current.emit("user_join", { name, room: room });
  };

  const onMessageSubmit = (e) => {
    let msgEle = document.getElementById("message");
    console.log([msgEle.name], msgEle.value);
    setState({ ...state, [msgEle.name]: msgEle.value });
    socketRef.current.emit("message", {
      name: state.name,
      message: msgEle.value,
      room: room,
    });
    e.preventDefault();
    setState({ message: "", name: state.name });
    msgEle.value = "";
    msgEle.focus();
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  console.log(room);
  return (
    <div>
      {/* <label for="rooms">Choose a room:</label>
      <select name="rooms" id="rooms">
        <option value="room1">Room 1</option>
        <option value="room2">Room 2</option>
        <option value="room3">Room 3</option>
      </select> */}
      {rooms.map((r, i) => (
        <button onClick={() => setRoom(r)} key={i}>
          {r}
        </button>
      ))}
      <h1>Current room: {room}</h1>
      {state.name && (
        <div className="card">
          <div className="render-chat">
            <h1>Chat Log</h1>
            {renderChat()}
          </div>
          <form onSubmit={onMessageSubmit}>
            <h1>Messenger</h1>
            <div>
              <input
                name="message"
                id="message"
                variant="outlined"
                label="Message"
              />
            </div>
            <button>Send Message</button>
          </form>
        </div>
      )}

      {!state.name && (
        <form
          className="form"
          onSubmit={(e) => {
            //console.log(document.getElementById("username_input").value);
            e.preventDefault();
            setState({ name: document.getElementById("username_input").value });
            userjoin(document.getElementById("username_input").value);
            // userName.value = '';
          }}
        >
          <div className="form-group">
            <label>
              User Name:
              <br />
              <input id="username_input" />
            </label>
          </div>
          <br />

          <br />
          <br />
          <button type="submit"> Click to join</button>
        </form>
      )}
    </div>
  );
}

export default ChatroomMaker;
