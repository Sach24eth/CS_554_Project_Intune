import React from "react";
import "./AlbumTable.css";

export const AlbumTable = ({ track, i, fn }) => {
    let artists = [];
    console.log(track)
    track.artists.forEach((artist) => {
        console.log(artist.name);
        artists.push(artist.name);
    });
    return (
        <div className="max-width">
            <div className="table">
                <p>{i + 1}</p>
                {/*<img alt={track.name} src={track.album.images[2].url} />*/}
                <p>{track.name}</p>
                <p>{artists.join(", ")}</p>
                <p className="dur">{fn(track.duration_ms)}</p>
            </div>
        </div>
    );
};
