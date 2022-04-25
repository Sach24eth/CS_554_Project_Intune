import React, { useEffect, useState } from "react";
import {
  FaBackward,
  FaPlay,
  FaPause,
  FaForward,
  FaVolumeUp,
  FaHeart,
  FaExpand,
  FaEllipsisV,
} from "react-icons/fa";
import axios from "axios";

const Player = () => {
  const [player, setPlayer] = useState(undefined);
  const [deviceId, setDeviceId] = useState(undefined);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState("0:00");
  const [seek, setSeek] = useState(0);
  const [active, setActive] = useState(false);
  const [currentSong, setCurrentSong] = useState(undefined);
  const token = window.localStorage.getItem("access_token");
  const apiUrl = "https://api.spotify.com/v1";
  const URL_PLAY = `${apiUrl}/me/player/play?device_id=${deviceId}`;
  const URL_PAUSE = `${apiUrl}/me/player/pause?device_id=${deviceId}`;
  const URL_NEXT = `${apiUrl}/me/player/next?device_id=${deviceId}`;
  const URL_PREV = `${apiUrl}/me/player/previous?device_id=${deviceId}`;
  const URL_RECENT_TRACKS = `${apiUrl}/me/player/recently-played`;
  const URL_STATUS = `${apiUrl}/me/player`;
  const URL_SONG = `${apiUrl}/tracks/`;
  const URL_TRANSFER = `${apiUrl}/me/player`;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Spotify x Discord",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      const connect = async () => {
        await player.connect();
      };

      connect();

      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
      });

      getData();
    };
  }, []);

  const onSeek = (e) => {
    setSeek((prev) => e.target.value);
  };

  const convertToTime = (millis) => {
    let seconds = millis / 1000;
    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds - minutes * 60);
    return `${minutes}:${seconds}`;
  };

  const getData = async () => {
    try {
      let { data } = await axios({
        method: "GET",
        url: URL_STATUS,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      if (data) {
        setDuration(convertToTime(data.item.duration_ms));
        const url = URL_SONG + data.item.id;
        try {
          let song = await axios({
            method: "GET",
            url: url,
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });
          setCurrentSong(song.data);
        } catch (e) {
          console.log(e);
        }
      } else {
        try {
          let { data } = await axios({
            method: "GET",
            url: URL_RECENT_TRACKS,
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });
          setCurrentSong(data.items[0].track);
        } catch (e) {
          console.log(e);
        }
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const transferPlayback = async () => {
    try {
      await axios({
        method: "PUT",
        url: URL_TRANSFER,
        data: {
          device_ids: [deviceId],
          play: true,
        },
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      setActive(true);
    } catch (e) {
      console.log(e);
    }
  };

  const playSong = async () => {
    if (!active) {
      await transferPlayback();
    } else {
      try {
        await axios({
          method: "PUT",
          url: URL_PLAY,
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });
      } catch (e) {
        console.log(e);
      }
    }
    setPlaying(true);
    getData();
  };

  const pauseSong = async () => {
    try {
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

  const nextSong = async () => {
    try {
      await axios({
        method: "POST",
        url: URL_NEXT,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.log(e);
    }
    setPlaying(true);
    getData();
  };

  const prevSong = async () => {
    try {
      await axios({
        method: "POST",
        url: URL_PREV,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.log(e);
    }
    setPlaying(true);
    getData();
  };

  const toggleFullscreen = async () => {};

  const writeArtists = (artists) => {
    let list = "";
    for (let i = 0; i < artists.length; i++) {
      list = list + artists[i].name;
      if (i != artists.length - 1) {
        list = list + ", ";
      }
    }
    return list;
  };

  if (currentSong) {
    return (
      <>
        <div className="bottom-player">
          <div className="track-img">
            <img src={currentSong.album.images[0].url} alt="track" />{" "}
            <div className="track-name">
              <p className="song">{currentSong.name}</p>
              <p className="artistName">{writeArtists(currentSong.artists)}</p>
            </div>
            <FaHeart className="heart icon" />
          </div>
          <div className="controls">
            <div className="icons">
              <FaBackward
                className="icon"
                onClick={() => {
                  prevSong();
                }}
              />
              {!playing && (
                <FaPlay
                  className="white icon"
                  onClick={() => {
                    playSong();
                  }}
                />
              )}
              {playing && (
                <FaPause
                  className="white icon"
                  onClick={() => {
                    pauseSong();
                  }}
                />
              )}
              <FaForward
                className="icon"
                onClick={() => {
                  nextSong();
                }}
              />
            </div>
            <div className="slider">
              <p className="time-playing font-sm">0:54</p>
              <p className="slider-control">
                <input
                  type={"range"}
                  width={"100%"}
                  className="slider-actual-pointer"
                  max={4 * 60000}
                  value={seek}
                  onChange={onSeek}
                />
                {/* <span className="slider-actual-pointer"></span> */}
              </p>
              <p className="time-total font-sm">{duration}</p>
            </div>
          </div>
          <div className="volume">
            <FaVolumeUp className="icon" />
            <FaExpand
              className="icon"
              onClick={() => {
                toggleFullscreen();
              }}
            />
          </div>
        </div>
        ;
      </>
    );
  } else {
    return <h1>Could not load player</h1>;
  }
};

export default Player;