import React, { useEffect, useState } from "react";
import {
  FaBackward,
  FaPlay,
  FaPause,
  FaForward,
  FaVolumeUp,
  FaVolumeMute,
  FaRandom,
  FaHeart,
  FaExpand,
} from "react-icons/fa";
import axios from "axios";

const Player = () => {
  const [player, setPlayer] = useState(undefined);
  const [deviceId, setDeviceId] = useState(undefined);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState("0:00");
  const [seek, setSeek] = useState(0);
  const [volume, setVolume] = useState(50);
  const [active, setActive] = useState(false);
  const [currentSong, setCurrentSong] = useState(undefined);
  const [shuffle, setShuffle] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [muted, setMuted] = useState(false);
  const token = window.localStorage.getItem("access_token");
  const apiUrl = "https://api.spotify.com/v1";
  let previousTime = 100000;
  let currentUri = 0;
  const URL_PLAY = `${apiUrl}/me/player/play?device_id=${deviceId}`;
  const URL_PAUSE = `${apiUrl}/me/player/pause?device_id=${deviceId}`;
  const URL_NEXT = `${apiUrl}/me/player/next?device_id=${deviceId}`;
  const URL_PREV = `${apiUrl}/me/player/previous?device_id=${deviceId}`;
  const URL_RECENT_TRACKS = `${apiUrl}/me/player/recently-played`;
  const URL_VOLUME = `${apiUrl}/me/player/volume?volume_percent=`;
  const URL_STATUS = `${apiUrl}/me/player`;
  const URL_SONG = `${apiUrl}/tracks/`;
  const URL_TRANSFER = `${apiUrl}/me/player`;
  const URL_SEEK = `${apiUrl}/me/player/seek?device_id=${deviceId}&position_ms=`;
  const URL_SHUFFLE = `${apiUrl}/me/player/shuffle?device_id=${deviceId}&state=`;
  const [renderPlayer, setRenderPlayer] = useState(true);
  useEffect(() => {
    const path = window.location.pathname;
    if (
      path === "/" ||
      path === "/auth/login" ||
      path === "/auth/signup" ||
      path === "/auth/logout"
    )
      setRenderPlayer((prev) => false);
  }, [window.location.pathname]);

  useEffect(() => {
    if (!renderPlayer) return;
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
        window.localStorage.setItem("deviceId", device_id);
      });

      getData();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const timeout = setInterval(async () => {
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
          if (data.progress_ms < previousTime || currentUri != data.item.id) {
            getData();
          }
          setSeek(data.progress_ms);
          setProgress(convertToTime(data.progress_ms));
          setPlaying(data.is_playing);
          previousTime = data.progress_ms;
          currentUri = data.item.id;
        }
        if (document.fullscreenElement == null) {
          setFullscreen(false);
        }
      } catch (e) {
        console.log(e);
      }
    }, 800);
    return () => {
      isMounted = false;
      clearInterval(timeout);
    };
  }, []);

  const convertToTime = (millis) => {
    let seconds = millis / 1000;
    let minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds - minutes * 60);
    if (seconds < 10) {
      return `${minutes}:0${seconds}`;
    }
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
        setDuration(data.item.duration_ms);
        setSeek(data.progress_ms);
        setProgress(convertToTime(data.progress_ms));
        setVolume(data.device.volume_percent);
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
          currentUri = song.data.id;
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
    getData();
  };

  const nextSong = async () => {
    if (!active) {
      await transferPlayback();
    } else {
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
    }
    setPlaying(true);
    await getData();
  };

  const prevSong = async () => {
    if (!active) {
      await transferPlayback();
    } else {
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
    }
    setPlaying(true);
    getData();
  };

  const toggleFullscreen = async () => {
    const container = document.querySelector("#root");
    if (!fullscreen) {
      container
        .requestFullscreen()
        .then(() => {
          setFullscreen(true);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      document
        .exitFullscreen()
        .then(() => {
          setFullscreen(false);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

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

  const moveVolume = async (e) => {
    setVolume((prev) => e.target.value);
  };

  const changeVolume = async (e) => {
    try {
      if (active) {
        if (e.target.value > 0) {
          setMuted(false);
        } else {
          setMuted(true);
        }
        await axios({
          method: "PUT",
          url: URL_VOLUME + e.target.value,
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const seekSong = async (e) => {
    setSeek((prev) => e.target.value);
  };

  const seekTrack = async (e) => {
    await axios({
      method: "PUT",
      url: URL_SEEK + seek,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    getData();
  };

  const toggleMute = async () => {
    if (active) {
      setMuted((currentMuted) => !currentMuted);
      if (muted) {
        try {
          await axios({
            method: "PUT",
            url: URL_VOLUME + "50",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });
          setVolume(50);
        } catch (e) {
          console.log(e);
        }
      } else {
        try {
          await axios({
            method: "PUT",
            url: URL_VOLUME + "0",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });
          setVolume(0);
        } catch (e) {
          console.log(e);
        }
      }
    }
  };

  const toggleShuffle = async () => {
    if (active) {
      await axios({
        method: "PUT",
        url: URL_SHUFFLE + !shuffle,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
    }
    setShuffle((currentShuffle) => !currentShuffle);
  };

  if (!renderPlayer) {
    return null;
  } else if (currentSong && renderPlayer) {
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
              <p className="time-playing font-sm">{progress}</p>
              <p className="slider-control">
                <input
                  type={"range"}
                  width={"100%"}
                  className="slider-actual-pointer"
                  max={duration}
                  value={seek}
                  onChange={seekSong}
                  onMouseUp={seekTrack}
                />
              </p>
              <p className="time-total font-sm">{convertToTime(duration)}</p>
            </div>
          </div>
          <div className="volume">
            <p className="slider-control">
              <input
                type={"range"}
                width={"100%"}
                className="slider-actual-pointer"
                max={100}
                value={volume}
                onChange={moveVolume}
                onMouseUp={changeVolume}
              />
            </p>
            {!muted && (
              <FaVolumeUp
                className="icon"
                onClick={() => {
                  toggleMute();
                }}
              />
            )}
            {muted && (
              <FaVolumeMute
                className="icon"
                onClick={() => {
                  toggleMute();
                }}
              />
            )}
            {shuffle && (
              <FaRandom
                className="icon"
                id="shuffleGreen"
                onClick={() => {
                  toggleShuffle();
                }}
              />
            )}
            {!shuffle && (
              <FaRandom
                className="icon"
                onClick={() => {
                  toggleShuffle();
                }}
              />
            )}
            {!fullscreen && (
              <FaExpand
                className="icon"
                onClick={() => {
                  toggleFullscreen();
                }}
              />
            )}
            {fullscreen && (
              <FaExpand
                className="icon"
                id="expandGreen"
                onClick={() => {
                  toggleFullscreen();
                }}
              />
            )}
          </div>
        </div>
      </>
    );
  } else {
    return <h1>Could not load player</h1>;
  }
};

export default Player;
