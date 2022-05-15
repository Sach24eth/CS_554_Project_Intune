import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Bubble from "../ArtistGenreBubble/buble";
import "./album.css";
import NoImage from "../../images/no-image-available.jpg";

const Album = () => {
  const id = new URLSearchParams(window.location.search).get("id");
  const [album, setAlbum] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    const authLocalStorage = parseInt(
      window.localStorage.getItem("authentication")
    );

    if (authLocalStorage === 0) {
      history("/auth/login");
    }
  }, []);

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
        setAlbum(res.data);
        setErr(false);
        console.log(res);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response);
        setErr(true);
        setLoading(false);
      });
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

  const playAlbum = (uri, i) => {
    const access_token = window.localStorage.getItem("access_token");
    if (!access_token) return toast.error("Connect to Spotify to Play Song");

    const body = {
      context_uri: uri,
      offset: {
        position: i,
      },
      position_ms: 0,
    };

    const deviceId = window.localStorage.getItem("deviceId");
    const apiUrl = "https://api.spotify.com/v1";
    const URL_PLAY = `${apiUrl}/me/player/play?device_id=${deviceId}`;

    axios
      .put(URL_PLAY, body, {
        headers: {
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      })
      .catch((e) => console.log(e.response));
  };
  console.log(err);
  return (
    <section id="album">
      {err ? (
        <div className="container">
          <h1>Error loading album</h1>
        </div>
      ) : (
        <div className="container">
          <Link to={"/me"}>
            <ToastContainer />
          </Link>

          <div className="album-cover">
            <img src={album.images[1].url || NoImage} alt={album.name} />
            <div className="album-info">
              <p className="type">{album.type}</p>
              <h1>{album.name}</h1>

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
                <div
                  key={i}
                  className="track"
                  id={track.uri}
                  onClick={() => {
                    playAlbum(album.uri, i);
                  }}
                >
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
      )}
    </section>
  );
};
export default Album;
