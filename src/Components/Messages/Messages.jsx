import React, { useEffect, useState } from "react";
import MessageChatCard from "./MessageChatCard/MessageChatCard";
import "./message.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firestore = require("../../Firebase/Firestore");
const TOKEN = window.localStorage.getItem("token");
const URL = "https://api.spotify.com/v1";

const Messages = () => {
  const auth = getAuth();
  const history = useNavigate();
  let tempMessagesRoom = [];
  const [usrData, setUsrData] = useState();
  const [usrgenres, setUsrGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [genres, setGenres] = useState([]);
  const [noRes, setNoRes] = useState("false");

  useEffect(() => {
    async function getGenre() {
      let id = null;
      axios
        .get(URL + "/recommendations/available-genre-seeds", {
          headers: {
            Authorization: "Bearer " + TOKEN,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setGenres(res.data.genres);
        })
        .catch((err) => console.log(err.response));
      onAuthStateChanged(auth, (user) => {
        if (user.uid || user) {
          setUsrData(user.displayName);
          firestore
            .getGenreData(user.uid)
            .then((res) => {
              for (let i = 0; i < res.genres.length; i++) {
                tempMessagesRoom[i] = { id: i, title: res.genres[i] };
              }
              setUsrGenres(tempMessagesRoom);
              if (!res.hasData) history("/genres");
            })
            .catch((err) => console.log(err));
        }
      });
    }
    getGenre();
  }, []);

  useEffect(() => {
    async function searchRooms() {
      try {
        let searchResults = [];
        if (!searchTerm || searchTerm.length !== 0) {
          //console.log("Searching this:", searchTerm.length);
          for (let i = 0; i < genres.length; i++) {
            //console.log("Genre:", genres[i], "searchTerm", searchTerm.toLowerCase())
            let tfFlag = genres[i].includes(searchTerm.toLowerCase());
            //console.log("TF Flag:", tfFlag);
            if (tfFlag === true) {
              // console.log("True vals", genres[i]);
              let objRoom = { id: i, title: genres[i].toUpperCase() };
              searchResults.push(objRoom);
              // setNoRes('false')
            }
          }
          console.log("not on state results:", searchResults.length);
          if (searchResults.length > 0) {
            setUsrGenres(searchResults);
          } else if (searchResults.length === 0) {
            console.log("Searching this searchRes:");
            setNoRes("true");
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
              if (user.uid || user) {
                //console.log("userData:", user.displayName);
                setUsrData(user.displayName);
                firestore
                  .getGenreData(user.uid)
                  .then((res) => {
                    for (let i = 0; i < res.genres.length; i++) {
                      tempMessagesRoom[i] = { id: i, title: res.genres[i] };
                    }
                    setUsrGenres(tempMessagesRoom);
                    if (!res.hasData) history("/genres");
                  })
                  .catch((err) => console.log(err));
              }
            });
          }
        }
        if (!searchTerm || searchTerm.length === 0) {
          console.log("clear Triggers");
          searchResults = [];
          onAuthStateChanged(auth, (user) => {
            if (user.uid || user) {
              setUsrData(user.displayName);
              firestore
                .getGenreData(user.uid)
                .then((res) => {
                  for (let i = 0; i < res.genres.length; i++) {
                    tempMessagesRoom[i] = { id: i, title: res.genres[i] };
                  }
                  setUsrGenres(tempMessagesRoom);
                  if (!res.hasData) history("/genres");
                })
                .catch((err) => console.log(err));
            }
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
    searchRooms();
  }, [searchTerm]);
  const resultText = (noResFlag) => {
    console.log("Functions", noResFlag);
    if (noRes === false) {
      console.log("Triggered if true");
      return null;
    }
  };

  return (
    <section id="rooms">
      <div className="header">
        <div className="container">
          <h1>Chatrooms</h1>
          <div className="search-chat">
            <label>
              <input
                type={"text"}
                placeholder="Search chatroom..."
                name="search-chat"
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
              />
            </label>
          </div>
          <br></br>
          <div className="messageContainer">
            {/* need to figure out how to display No results found in the window itself */}
            {usrgenres.map((room, i) => {
              return <MessageChatCard key={i} chat={room} userName={usrData} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Messages;
