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
  const [searchTerm, setSearchTerm] = useState("");
  const [genres,setGenres]=useState([]);
  const [noRes, setNoRes] = useState('false');
  const [searchRes,setSearchRes]=useState([]);
  useEffect(() => {
    async function getGenre() {
      // const id =JSON.parse(window.localStorage.getItem("userDetails")).uid || null;
      // console.log(id)
      let id = null;
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

  useEffect(() => {
    console.log("Search Triggered");
    async function searchRooms() {
      try {
        let searchResults = [];
        if (searchTerm.length > 0) {
          for (let i = 0; i < genres.length; i++) {
            if (genres[i].includes(searchTerm.toLowerCase()) === 'true') {
              searchResults.push(genres[i]);
            }
          }
          if (searchResults.length > 0) {
            setSearchRes(searchResults)
          } else {
            setNoRes('true')
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
    searchRooms();
  }, [searchTerm])
  console.log("Results:", searchRes);
  // console.log("flag: ",noRes);
  //console.log("All Genres:", genres);
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
            onChange={(event) => {
              setSearchTerm(event.target.value);
            } }
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
