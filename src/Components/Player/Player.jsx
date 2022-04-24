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
import { BsBroadcast } from "react-icons/bs";
import axios from "axios";

const Player = () => {
  const [player, setPlayer] = useState(undefined);
  const [deviceId, setDeviceId] = useState(undefined);
  const [playing, setPlaying] = useState(false);
  const apiUrl = "https://api.spotify.com/v1";
  const URL_PLAY = `${apiUrl}/me/player/play?device_id=${deviceId}`;
  const URL_PAUSE = `${apiUrl}/me/player/pause?device_id=${deviceId}`;
  const URL_NEXT = `${apiUrl}/me/player/next?device_id=${deviceId}`;
  const URL_PREV = `${apiUrl}/me/player/previous?device_id=${deviceId}`;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token =
        "BQBr-ukrl2YtMWiTIHbU2yPsXeqkc8-wo9UZqFU4i--Oy6JHvnUbUhM7L_78PzftX5ZNvfIkkKRhTcK6D7c5IABXXS0Xphbi6xr1drfcBO-1a0oP7na8hdzwM0DxdMdsNgun-uzBhRfqtE4RMDeoxod7Z-XHo6si1j4";
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
    };
  }, []);

  const playSong = async () => {
    const userToken = window.localStorage.getItem("access_token");
    const token =
      "BQD30BoUkOEQVAkOs-IZAe29DV5nkFoCXvdeUyRRREYOXiAjy-3p2su10bz_AjTadMxaUUT5avaNDDkBMOZLVkSkehSFhlmsL2ePd2sWd4oKPFb8fLKAJ5fjewHK1DDrf8chCPjlULlaHalUK8nfvTeCehI";
    let data = null;
    try {
      data = await axios({
        method: "PUT",
        url: URL_PLAY,
        body: {
          context_uri: "spotify:track:23Ij3xEFmYkRl00dDJCVMP",
          offset: {
            position: 0,
          },
          position_ms: 0,
        },
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.log(e);
    }
    setPlaying(true);
  };

  const pauseSong = async () => {
    const token =
      "BQD30BoUkOEQVAkOs-IZAe29DV5nkFoCXvdeUyRRREYOXiAjy-3p2su10bz_AjTadMxaUUT5avaNDDkBMOZLVkSkehSFhlmsL2ePd2sWd4oKPFb8fLKAJ5fjewHK1DDrf8chCPjlULlaHalUK8nfvTeCehI";
    let data = null;
    try {
      data = await axios({
        method: "PUT",
        url: URL_PAUSE,
        body: {
          context_uri: "spotify:track:23Ij3xEFmYkRl00dDJCVMP",
          offset: {
            position: 0,
          },
          position_ms: 0,
        },
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
    const token =
      "BQD30BoUkOEQVAkOs-IZAe29DV5nkFoCXvdeUyRRREYOXiAjy-3p2su10bz_AjTadMxaUUT5avaNDDkBMOZLVkSkehSFhlmsL2ePd2sWd4oKPFb8fLKAJ5fjewHK1DDrf8chCPjlULlaHalUK8nfvTeCehI";
    let data = null;
    try {
      data = await axios({
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
  };

  const prevSong = async () => {
    const token =
      "BQD30BoUkOEQVAkOs-IZAe29DV5nkFoCXvdeUyRRREYOXiAjy-3p2su10bz_AjTadMxaUUT5avaNDDkBMOZLVkSkehSFhlmsL2ePd2sWd4oKPFb8fLKAJ5fjewHK1DDrf8chCPjlULlaHalUK8nfvTeCehI";
    let data = null;
    try {
      data = await axios({
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
  };

  const toggleFullscreen = async () => {};

  if (player) {
    console.log(deviceId);
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
                <span className="slider-actual-pointer"></span>
              </p>
              <p className="time-total font-sm">4:00</p>
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
            <FaEllipsisV className="icon" />
            <BsBroadcast className="icon" />
          </div>
        </div>
        ;
      </>
    );
  } else {
    console.log(player);
    return <h1>Ayo</h1>;
  }
};

export default Player;
