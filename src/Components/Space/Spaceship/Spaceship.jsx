import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import { BiAddToQueue } from "react-icons/bi";
import "./spaceship.css";
import NoSongHolder from "../../../images/nosong.png";
import { toast, ToastContainer } from "react-toastify";

const Spaceship = ({ socket, hideStatus, spaceOwner }) => {
  const [search, setSearch] = useState(undefined);
  const [result, setResult] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [song, setSong] = useState(undefined);
  const apiUrl = "https://api.spotify.com/v1";
  const SEARCH_URL = `${apiUrl}/search`;
  const genricToken = window.localStorage.getItem("token");
  const token = window.localStorage.getItem("access_token");
  let deviceId = window.localStorage.getItem("deviceId");
  const inviteCode =
    window.localStorage.getItem("code") ||
    new URLSearchParams(window.location.search).get("inviteCode");

  useEffect(() => {
    socket.on("user-space-connected", ({ username, uid, code }) => {
      console.log(username, code);
    });

    socket.on("play", ({ uri }) => {
      if (hideStatus) {
        getTrackData(uri.split(":")[2]);
        playUri(uri);
      }
    });
  }, []);

  useEffect(() => {
    async function playerStatus() {
      const URL_STATUS = `${apiUrl}/me/player`;
      let { data } = await axios({
        method: "GET",
        url: URL_STATUS,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      console.log(data);
      if (data) {
        const URL_SONG = `${apiUrl}/tracks/`;
        const url = URL_SONG + data.item.id;
        console.log(data.item.id);
        try {
          let song = await axios({
            method: "GET",
            url: url,
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });
          setSong(song.data);
        } catch (e) {
          console.log(e);
        }
      }
    }

    const interval = setInterval(() => {
      playerStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    socket.on("add-to-queue", ({ uri }) => {
      console.log(uri);
      addToQueue(uri);
    });
  }, []);

  const playUri = async (uri) => {
    deviceId = window.localStorage.getItem("deviceId");

    try {
      const URL_PLAY = `${apiUrl}/me/player/play?device_id=${deviceId}`;
      axios({
        method: "PUT",
        url: URL_PLAY,
        data: {
          uris: [uri],
        },
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          setPlaying((prev) => true);
          setResult([]);
        })
        .catch((err) => {
          toast.error(err.response.message);
        });
    } catch (e) {
      console.log(e.response);
      toast.error(e.response);
    }
  };

  // const pauseSong = async () => {
  //   try {
  //     const URL_PAUSE = `${apiUrl}/me/player/pause?device_id=${deviceId}`;
  //     await axios({
  //       method: "PUT",
  //       url: URL_PAUSE,
  //       headers: {
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   setPlaying(false);
  // };

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
    if (e.target.value === "") setResult([]);
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

  const addToQueue = (uri) => {
    const URL_QUEUE =
      apiUrl + `/me/player/queue?uri=${uri}&device_id=${deviceId}`;
    axios({
      method: "POST",
      url: URL_QUEUE,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        toast.success("Added to queue");
        setResult([]);
        // setHasQueue(true);
      })
      .catch((err) => {
        toast.error("Failed to add");
      });
  };

  return (
    <div id="spaceship">
      <div className="space-cont">
        <ToastContainer />
        <div className="top">
          <div className="status">Spotify Space: Connected</div>
          <div className="invite">Invite Code: {inviteCode}</div>
        </div>
        <div className="space-body">
          {spaceOwner && (
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
          {hideStatus && result.length === 0 && (
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
                {/* <div className="controls">
                  {playing ? (
                    <FaPause className="icon" size={30} onClick={pauseSong} />
                  ) : (
                    <FaPlay
                      className="icon"
                      size={30}
                      onClick={() => {
                        playUri(song.uri);
                      }}
                    />
                  )}
                </div> */}
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
                <div className="search-res" id={song.uri}>
                  <div
                    onClick={async (e) => {
                      socket.emit("user-space-play", {
                        uri: song.uri,
                        inviteCode,
                      });

                      playUri(song.uri);
                      getTrackData(song.uri.split(":")[2]);
                    }}
                  >
                    <img src={song.album.images[2].url} alt={song.name} />
                    <div className="artist-info">
                      <p className="song-name">{song.name}</p>
                      <p className="artists">{artists.join(", ")}</p>
                    </div>
                  </div>
                  <div className="right">
                    <div className="play">
                      <FaPlay size={20} />
                    </div>
                    <div
                      className="queue"
                      title="Add to Queue"
                      id="queue"
                      onClick={() => {
                        socket.emit("spotify-space-queue", {
                          uri: song.uri,
                          room: inviteCode,
                        });
                        addToQueue(song.uri);
                      }}
                    >
                      <BiAddToQueue size={20} title="Add to Queue" />
                    </div>
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
