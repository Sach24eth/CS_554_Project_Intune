import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import "./spaceship.css";
import NoSongHolder from "../../../images/nosong.png";

const Spaceship = ({ socket, hideStatus }) => {
  const [search, setSearch] = useState(undefined);
  const [result, setResult] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [song, setSong] = useState(undefined);
  const apiUrl = "https://api.spotify.com/v1";
  const SEARCH_URL = `${apiUrl}/search`;
  const genricToken = window.localStorage.getItem("token");
  const token = window.localStorage.getItem("access_token");
  const deviceId = window.localStorage.getItem("deviceId");
  const inviteCode =
    window.localStorage.getItem("code") ||
    new URLSearchParams(window.location.search).get("inviteCode");

  useEffect(() => {
    socket.on("user-space-connected", ({ username, uid, code }) => {
      console.log(username, code);
    });
  });

  useEffect(() => {
    socket.on("play", ({ uri }) => {
      playUri(uri);
      getTrackData(uri.split(":")[2]);
    });
  }, []);

  const playUri = async (uri) => {
    try {
      const URL_PLAY = `${apiUrl}/me/player/play?device_id=${deviceId}`;
      axios({
        method: "PUT",
        url: URL_PLAY,
        data: {
          uris: [uri],
          position_ms: 0,
        },
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
        .then((res) => setPlaying((prev) => !prev))
        .catch((err) => console.log(err.response));
    } catch (e) {
      console.log(e.response);
    }
  };

  const pauseSong = async () => {
    try {
      const URL_PAUSE = `${apiUrl}/me/player/pause?device_id=${deviceId}`;
      await axios({
        method: "PUT",
        url: URL_PAUSE,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.log(e);
    }
    setPlaying(false);
  };

  const getTrackData = async (id) => {
    try {
      const URL_TRACK = `${apiUrl}/tracks/${id}`;
      axios({
        method: "GET",
        url: URL_TRACK,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log(res.data);
          setSong(res.data);
        })
        .catch((err) => console.log(err.respnse));
    } catch (error) {
      console.log(error);
    }
  };

  const onImageLoadErr = (e) => {
    e.target.src = NoSongHolder;
  };

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
    // if (e.target.value === "") setResult([]);
    setSearch(e.target.value);
  };

  const writeArtists = (artists) => {
    let list = "";
    for (let i = 0; i < artists.length; i++) {
      list = list + artists[i].name;
      if (i !== artists.length - 1) {
        list = list + ", ";
      }
    }
    return list;
  };
  return (
    <div id="spaceship">
      <div className="space-cont">
        <div className="top">
          <div className="status">Spotify Space: Connected</div>
          <div className="invite">Invite Code: {inviteCode}</div>
        </div>
        <div className="space-body">
          {!hideStatus && (
            <div className="search-music">
              <label>
                <input
                  type={"text"}
                  placeholder={"Search Songs..."}
                  onChange={onSearchTextChange}
                />
              </label>
            </div>
          )}
          {hideStatus && (
            <div className="player">
              <img
                width={200}
                height={200}
                src={song ? song?.album?.images[0]?.url : NoSongHolder}
                onError={onImageLoadErr}
                alt="song poster"
              />
              <div className="song-details">
                <div className="song">
                  <h1>{song ? song.name : "Song not playing"}</h1>
                  <p>{song ? writeArtists(song.artists) : ""}</p>
                </div>
                <div className="controls">
                  {/* <FaBackward className="icon" size={20} /> */}
                  {playing ? (
                    <FaPause className="icon" size={30} />
                  ) : (
                    <FaPlay className="icon" size={30} />
                  )}
                  {/* <FaForward className="icon" size={20} /> */}
                </div>
              </div>
            </div>
          )}
          <div className="search-container">
            {result.map((song) => {
              let artists = [];
              song.album.artists.forEach((artist) => {
                artists.push(artist.name);
              });
              return (
                <div
                  className="search-res"
                  id={song.uri}
                  onClick={async () => {
                    socket.emit("user-space-play", {
                      uri: song.uri,
                      inviteCode,
                    });

                    playUri(song.uri);
                  }}
                >
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
        </div>
      </div>
    </div>
  );
};

export default Spaceship;
