import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaBackward, FaPlay, FaForward } from "react-icons/fa";
import "./spaceship.css";
import { generateCode } from "../../../Services/generateCode";
const Spaceship = () => {
  const [search, setSearch] = useState(undefined);
  const [result, setResult] = useState([]);
  const apiUrl = "https://api.spotify.com/v1";
  const SEARCH_URL = `${apiUrl}/search`;
  const genricToken = window.localStorage.getItem("token");
  const inviteCode = generateCode();

  useEffect(() => {
    if (!search) return;
    axios
      .get(`${SEARCH_URL}?type=track&q=${search}`, {
        headers: {
          Authorization: "Bearer " + genricToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data.tracks.items);
        setResult(res.data.tracks.items);
      })
      .catch((err) => console.log(err));
  }, [search, SEARCH_URL, genricToken]);

  const onSearchTextChange = (e) => {
    if (e.target.value === "") setResult([]);
    setSearch(e.target.value);
  };
  console.log(result);
  return (
    <div id="spaceship">
      <div className="space-cont">
        <div className="top">
          <div className="status">Spotify Space: Connected</div>
          <div className="invite">Invite Code: {inviteCode}</div>
        </div>
        <div className="space-body">
          <div className="search-music">
            <label>
              <input
                type={"text"}
                placeholder={"Search Songs..."}
                onChange={onSearchTextChange}
              />
            </label>
          </div>
          {result.length === 0 ? (
            <div className="player">
              <img
                width={200}
                height={200}
                src="https://i.scdn.co/image/ab67616d00001e02c50ee26def224e163f54ae0c"
                alt="song poster"
              />
              <div className="song-details">
                <div className="song">
                  <h1>Hurricane (Arcano Remix)</h1>
                  <p>Cheat Codes, Grey, Tyson Ritter, Arcando</p>
                </div>
                <div className="controls">
                  <FaBackward className="icon" size={20} />
                  <FaPlay className="icon" size={30} />
                  <FaForward className="icon" size={20} />
                </div>
              </div>
            </div>
          ) : (
            <div className="search-container">
              {result.map((song) => {
                let artists = [];
                song.album.artists.forEach((artist) => {
                  artists.push(artist.name);
                });
                return (
                  <div className="search-res">
                    <div>
                      <img src={song.album.images[2].url} alt={song.name} />
                      <div className="artist-info">
                        <p className="song-name">{song.name}</p>
                        <p className="artists">{artists.join(", ")}</p>
                      </div>
                    </div>
                    <div className="play">
                      <FaPlay size={20} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Spaceship;
