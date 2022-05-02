import React, { useState, useEffect } from "react";

const Playback = ({ uri }) => {
  const [player, setPlayer] = useState(undefined);
  const token = window.localStorage.getItem("access_token");
  console.log(token);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "CS554_Project",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 1,
      });
      setPlayer(player);
      player.addListener("ready", ({ device_id }) => {
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
        play({
          playerInstance: player,
          spotify_uri: ["spotify:track:7xGfFoTpQ2E7fRF5lN10tr"],
        });
        player.togglePlay().then(() => {
          console.log("Toggled playback!");
        });
      });
      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });
      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }
        console.log(state);
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
          console.log("Playing Next", next_track);
        });
      });
      player.connect();
    };
  }, []);
  // const nextTrack = () => {
  //   player.togglePlay().then(() => {
  //     console.log("Toggled playback!");
  //   });
  // };
  return (
    <div>
      <h1> Player Connected: {player ? true : false}</h1>
      {/* <span onClick={nextTrack}>Next</span> */}
    </div>
  );
};

export default Playback;
