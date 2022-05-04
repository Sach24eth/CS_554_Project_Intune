import axios from "axios";
import React, { useState, useEffect } from "react";
import Bubble from "../ArtistGenreBubble/buble";
import "./album.css";

const Album = () => {
  const id = new URLSearchParams(window.location.search).get("id");
  const [album, setAlbum] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = "https://api.spotify.com/v1/albums/";
    const token = window.localStorage.getItem("token");
    axios
      .get(apiUrl + id, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        setAlbum(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err.response));
  }, [id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const covertArtists = (artists) => {
    let artistsArray = artists.map((artist) => artist.name);
    return artistsArray.join(", ");
  };

  const millisToMinutesAndSeconds = (millis) => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  return (
    <section id="album">
      <div className="container">
        <div className="album-cover">
          <img src={album.images[1].url} alt={album.name} />
          <div className="album-info">
            <p className="type">{album.type}</p>
            <h1>{album.name}</h1>
            {/* <p className="artist">{covertArtists(album.artists)}</p> */}
            <div className="artists">
              {album.artists.map((artist) => {
                return <Bubble key={artist.name} genre={artist.name} />;
              })}
              <Bubble genre={album.label} />
            </div>
          </div>
        </div>
        <div className="tracks">
          {album.tracks.items.map((track, i) => {
            console.log(track);
            return (
              <div key={i} className="track" id={track.uri}>
                <div className="left">
                  <p className="count">{i + 1}</p>
                  <div className="row">
                    <h1>{track.name}</h1>
                    <p className="artist">{covertArtists(track.artists)}</p>
                  </div>
                </div>
                <div className="right">
                  <p className="dur">
                    {millisToMinutesAndSeconds(track.duration_ms)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default Album;
