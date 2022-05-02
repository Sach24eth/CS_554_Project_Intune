import React from "react";
import "./table.css";

export const Table = ({ track, i, fn }) => {
  let artists = [];
  track.track.artists.forEach((artist) => {
    console.log(artist.name);
    artists.push(artist.name);
  });
  return (
    <div className="max-width">
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
