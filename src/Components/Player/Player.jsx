import React, { useState, useEffect } from "react";
import {
  FaBackward,
  FaPlay,
  FaForward,
  FaVolumeUp,
  FaHeart,
  FaExpand,
  FaEllipsisV,
} from "react-icons/fa";
import { BsBroadcast } from "react-icons/bs";

const Player = () => {
  const [player, setPlayer] = useState(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTS, setCurrentTS] = useState(0);
  const [duration, setDuration] = useState(undefined);
  const token = window.localStorage.getItem("access_token");

  const convertToMinutes = (duration) => {
    var minutes = Math.floor(duration / 60000);
    var seconds = ((duration % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  useEffect(() => {
    let updateTS;
    if (isPlaying) {
      console.log("isPlaying: " + isPlaying);
      updateTS = setInterval(() => {
        console.log(currentTS);
        setCurrentTS((prev) => Number(prev + 1000));
      }, 1000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "CS554_Project",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 1,
      });
      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        const iframe = document.querySelector(
          'iframe[src="https://sdk.scdn.co/embedded/index.html"]'
        );
        if (iframe) {
          iframe.style.display = "block";
          iframe.style.position = "absolute";
          iframe.style.top = "-1000px";
          iframe.style.left = "-1000px";
        }
        const play = ({
          spotify_uri,
          playerInstance: {
            _options: { getOAuthToken },
          },
        }) => {
          getOAuthToken((token) => {
            fetch(
              `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
              {
                method: "PUT",
                body: JSON.stringify({ uris: spotify_uri }),
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          });
        };
        //"spotify:track:7xGfFoTpQ2E7fRF5lN10tr"
        play({
          playerInstance: spotifyPlayer,
          spotify_uri: ["spotify:track:7xGfFoTpQ2E7fRF5lN10tr"],
        });
        player.togglePlay().then(() => {
          console.log("Toggled playback!");
          setIsPlaying((prev) => !prev);
        });
      });
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });
      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }

        player.getCurrentState().then((state) => {
          if (!state) {
            console.error(
              "User is not playing music through the Web Playback SDK"
            );
            return;
          }
          var current_track = state.track_window.current_track;
          var next_track = state.track_window.next_tracks[0];
          console.log("Currently Playing", current_track);
          setDuration(current_track.duration_ms);
          console.log("Playing Next", next_track);
        });
      });
      player?.connect();
    };
  }, []);

  const onSeek = (e) => {
    setCurrentTS(e.target.value);
  };
  return (
    <>
      <div className="bottom-player">
        <div className="track-img">
          <img
            src="https://i.scdn.co/image/ab67616d00001e02c50ee26def224e163f54ae0c"
            alt="track"
          />
          <div className="track-name">
            <p className="song">Hurricane (Arcano Remix)</p>
            <p className="artistName">
              Cheat Codes, Grey, Tyson Ritter, Arcando
            </p>
          </div>
          <FaHeart className="heart icon" />
        </div>
        <div className="controls">
          <div className="icons">
            <FaBackward className="icon" />
            <FaPlay className="white icon" />
            <FaForward className="icon" />
          </div>
          <div className="slider">
            <p className="time-playing font-sm">
              {currentTS ? convertToMinutes(currentTS) : "-:--"}
            </p>
            <p className="slider-control">
              <input
                type={"range"}
                width={"100%"}
                className="slider-actual-pointer"
                max={duration}
                value={currentTS}
                onChange={onSeek}
              />
            </p>
            <p className="time-total font-sm">
              {duration ? convertToMinutes(duration) : "-:--"}
            </p>
          </div>
        </div>
        <div className="volume">
          <FaVolumeUp className="icon" />
          <FaExpand className="icon" />
          <FaEllipsisV className="icon" />
          <BsBroadcast className="icon" />
        </div>
      </div>
    </>
  );
};

export default Player;
