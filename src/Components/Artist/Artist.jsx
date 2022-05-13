import axios from "axios";
import React, { useEffect, useState } from "react";
import "./artist.css";
import Bubble from "../ArtistGenreBubble/buble";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
import { toast, ToastContainer } from "react-toastify";
import NoImage from "../../images/no-image-available.jpg";

const Artist = () => {
  const id = new URLSearchParams(window.location.search).get("id");

  const [artistInfo, setArtistInfo] = useState({});
  const [artistTracks, setArtistTracks] = useState([]);
  const [artistAlbum, setArtistAlbum] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);
  const access_token = window.localStorage.getItem("access_token") || null;

  const history = useNavigate();
  const redirToAlbum = (e) => {
    const id = e.target.id;
    history(`/album?id=${id.split(":")[2]}`);
  };

  useEffect(() => {
    const apiURL = `https://api.spotify.com/v1/artists`;
    const genricToken = window.localStorage.getItem("token");
    axios
      .get(`${apiURL}/${id}`, {
        headers: {
          Authorization: "Bearer " + genricToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        setArtistInfo({
          artistId: id,
          genres: res.data.genres,
          image: res.data?.images[1]?.url || NoImage,
          name: res.data.name,
          followers: res.data.followers.total,
          uri: res.data.uri,
        });
      })
      .catch((err) => {
        setErr(true);
        setLoading(false);
        console.log(err);
        return;
      });

    axios
      .get(`${apiURL}/${id}/top-tracks?market=US`, {
        headers: {
          Authorization: "Bearer " + genricToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data.tracks);
        setArtistTracks(res.data.tracks);
      })
      .catch((err) => {
        setErr(true);
        setLoading(false);
        console.log(err);
        return;
      });

    axios
      .get(`${apiURL}/${id}/albums?limit=10`, {
        headers: {
          Authorization: "Bearer " + genricToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        setArtistAlbum(res.data.items);
        setLoading(false);
      })
      .catch((err) => {
        setErr(true);
        console.log(err);
        setLoading(false);
        return;
      });
  }, [id]);

  if (loading) {
    return (
      <section id="artist">
        <div className="container">
          <div className="loading">
            <Spinner />
            <h1>Loading...</h1>
          </div>
        </div>
      </section>
    );
  } else
    return (
      <section id="artist">
        <ToastContainer />
        {err ? (
          <div className="container">
            <h1>Error loading artist.</h1>
          </div>
        ) : (
          <div className="container">
            <div className="artist">
              <div className="image">
                <img width={300} src={artistInfo.image} alt={artistInfo.name} />
              </div>
              <div className="artist-details">
                <div className="artistName">{artistInfo.name}</div>
                {artistInfo.followers && (
                  <div className="followers">
                    Followers: {artistInfo.followers.toLocaleString("en-US")}
                  </div>
                )}
                <div className="genres">
                  {artistInfo.genres?.map((genre, i) => {
                    return <Bubble genre={genre} key={i} />;
                  })}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="top">
                <h1>Top Tracks</h1>
                <div className="artist-tracks">
                  {artistTracks.length > 0 ? (
                    artistTracks.map((track, i) => {
                      let artist = [];
                      track.album.artists.forEach((art) =>
                        artist.push(art.name)
                      );
                      return (
                        <div
                          onClick={async () => {
                            if (!access_token)
                              return toast.error("Connect to spotify to play");
                            try {
                              const token =
                                window.localStorage.getItem("access_token");
                              const deviceId =
                                window.localStorage.getItem("deviceId");
                              const apiUrl = "https://api.spotify.com/v1";
                              const URL_PLAY = `${apiUrl}/me/player/play?device_id=${deviceId}`;
                              await axios({
                                method: "PUT",
                                url: URL_PLAY,
                                data: {
                                  uris: [track.uri],
                                  position_ms: 0,
                                },
                                headers: {
                                  Authorization: "Bearer " + token,
                                  "Content-Type": "application/json",
                                },
                              });
                            } catch (e) {
                              console.log(e.response);
                            }
                          }}
                          className="track"
                          id={track.uri}
                          key={track.id}
                        >
                          <div className="left">
                            <p>{i + 1}</p>
                            <div className="image">
                              <img
                                src={track.album.images[2].url || NoImage}
                                alt={track.name}
                              />
                            </div>
                          </div>
                          <div className="right">
                            <h1>{track.name}</h1>
                            <p className="artists">{artist.join(", ")}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <h1>No Tracks</h1>
                  )}
                </div>
              </div>
              <div className="albums">
                <h1>Albums</h1>
                <div className="artist-tracks">
                  {artistAlbum.map((album, i) => {
                    let artist = [];
                    album.artists.forEach((art) => artist.push(art.name));

                    return (
                      <div
                        onClick={redirToAlbum}
                        className="track"
                        id={album.uri}
                        key={album.id}
                      >
                        <div className="left" id={album.uri}>
                          <p id={album.uri}>{i + 1}</p>
                          <div className="image" id={album.uri}>
                            <img
                              src={album.images[2].url || NoImage}
                              id={album.uri}
                              alt={album.name}
                            />
                          </div>
                        </div>
                        <div className="right" id={album.uri}>
                          <h1 id={album.uri}>{album.name}</h1>
                          <p className="artists" id={album.uri}>
                            {artist.join(", ")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    );
};

export default Artist;
