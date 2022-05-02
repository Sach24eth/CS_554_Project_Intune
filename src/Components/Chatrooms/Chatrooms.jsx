import React, { useEffect, useRef, useState, Component  } from "react";
import { io } from "socket.io-client"
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./Chatrooms.css"
import axios from "axios";
const TOKEN = window.localStorage.getItem("token");
//console.log(TOKEN);
const URL = "https://api.spotify.com/v1";


function ChatroomMaker() {
    const auth = getAuth();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const roomnumber = urlParams.get("room");
    //console.log("Htting the route chatrooms", roomnumber);
    //
    const rooms = [];
    const [room, setRoom] = useState();
    const [usrData, setUsrData] = useState();
    const [genres,setGenres]=useState([]);
    const [state, setState] = useState({ message: "", name: "" });
    const [chat, setChat] = useState([]); 
    const socketRef = useRef();
    
    // Use effect to get chatroom userDetails
    useEffect(() => {
        async function getGenre() {
          //let id = null;
          axios
            .get(URL + "/recommendations/available-genre-seeds", {
              headers: {
                Authorization: "Bearer " + TOKEN,
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              //console.log("All Genres data",res.data.genres);
                setGenres(res.data.genres);
                
            })
            .catch((err) => console.log(err.response));
          
          onAuthStateChanged(auth,user => {
            if (user.uid || user) {
              //console.log("userData:", user.displayName);
                setUsrData(user.displayName);
            }
          });
        }
        getGenre();
    }, [auth]);
    const userjoin = (name) => {
        if (name !== undefined) {
            console.log("defined")
            socketRef.current.emit("user_join", { name, room: room });
        }
    };
    useEffect(() => {
        const genresUpper = genres.map(element => {
            return element.toUpperCase();
          });
        let findFlag = genresUpper.includes(roomnumber);
        if (findFlag) {
            setRoom(roomnumber)
        }
        setState({ name: usrData })
        userjoin(usrData)
        //setState({ message: "", name: usrData });
    },[genres,roomnumber,usrData])
    
    //Server setup
    useEffect(() => {
        //socketRef.current = io("ws://localhost:4000/");
        socketRef.current = io("/");
        //console.log("hello server: ", socketRef.current)
        return () => {
        socketRef.current.disconnect();
        };  
    }, []);
    //console.log("Room number is set: ", room)
    // Use effect for setting chat status
    useEffect(() => {
        //console.log("Message start",socketRef.current);
        socketRef.current.on("message", ({ name, message, room }) => {
            //console.log(`Setting Chat.... Name: ${name} Message: ${message} Room: ${room}`)
            setChat([...chat, { name, message, room }]);
        });
        socketRef.current.on("user_join", function (data) {
        //console.log("user_join",data.name)
        setChat([
                ...chat,
                {
                    name: "SpotBot",
                    message: `${data.name} has joined the chat`,
                    room: data.room,
                },
            ]);
        });
    }, [chat, room]);
    //console.log("Chat:", chat);
    //console.log("Room:", room);
    

    const onMessageSubmit = (e) => {
        let msgEle = document.getElementById("message");
        //console.log([msgEle.name], msgEle.value);
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

    //console.log(room);
    return (
        <div>
        <h1>Current room: {room}</h1>
        {state.name && (
            <div className="card">
              <div className="render-chat">
                <h1>Chat Log</h1>
                {renderChat()}
              </div >
                <form className= "messageBox" onSubmit={onMessageSubmit}>
                  <div>
                    <input
                      name="message"
                      placeholder="Say 'hi!'"
                      id="message"
                      variant="outlined"
                      label="Message"
                    />
                  </div>
                <button>Send Message</button>
                </form>
              </div>
          )}
        </div>
      );
}

export default ChatroomMaker;
