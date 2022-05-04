import React from "react";
import axios from "axios";
import "./table.css";

export const Table = ({ track, i, fn, playlist }) => {
  let artists = [];
  track.track.artists.forEach((artist) => {
    artists.push(artist.name);
  });

  const context = playlist.uri
    ? { context_uri: playlist.uri }
    : { uris: [playlist.track.uri] };

  const key = Object.keys(context)[0];
  let body = {};
  if (key === "uris") {
    body[key] = context[key];
    body.position_ms = 0;
  } else {
    body[key] = context[key];
    body.offset = { position: i };
    body.position_ms = 0;
  }
  return (
    <div
      className="max-width"
      onClick={async () => {
        try {
          const token = window.localStorage.getItem("access_token");
          const deviceId = window.localStorage.getItem("deviceId");
          const apiUrl = "https://api.spotify.com/v1";
          const URL_PLAY = `${apiUrl}/me/player/play?device_id=${deviceId}`;
          await axios({
            method: "PUT",
            url: URL_PLAY,
            data: body,
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });
        } catch (e) {
          console.log(e.response);
        }
      }}
    >
      <div className="table">
        <p className="id">{i + 1}</p>
        <img alt={track.track.name} src={track.track.album.images[2].url} />
        <p>{track.track.name}</p>
        <p>{artists.join(", ")}</p>
        <p className="dur">{fn(track.track.duration_ms)}</p>
      </div>
    </div>
  );
};
