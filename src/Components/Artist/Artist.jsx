import axios from "axios";
import React, { useEffect, useState } from "react";
import "./artist.css";
import Spinner from "../Spinner";
import Bubble from "../ArtistGenreBubble/buble";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Artist = () => {
  const id = new URLSearchParams(window.location.search).get("id");

  const [artistInfo, setArtistInfo] = useState({});
  const [artistTracks, setArtistTracks] = useState([]);
  const [artistAlbum, setArtistAlbum] = useState([]);
  const [loading, setLoading] = useState(true);

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
          image: res.data.images[1].url,
          name: res.data.name,
          followers: res.data.followers.total,
          uri: res.data.uri,
        });
      })
      .catch((err) => console.log(err.response));

    axios
      .get(`${apiURL}/${id}/top-tracks?market=US`, {
        headers: {
          Authorization: "Bearer " + genricToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setArtistTracks(res.data.tracks);
      })
      .catch((err) => console.log(err.response));

    axios
      .get(`${apiURL}/${id}/albums?limit=10`, {
        headers: {
          Authorization: "Bearer " + genricToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        // setArtistTracks(res.data.tracks);
        setArtistAlbum(res.data.items);
        setLoading(false);
      })
      .catch((err) => console.log(err.response));
  }, [id]);

  // console.log(artistInfo);
  console.log(artistAlbum);

  if (loading) {
    return <h1>Loading...</h1>;
  } else
    return (
      <section id="artist">
        <div className="container">
          <div className="artist">
            <div className="image">
              <img src={artistInfo.image} alt={artistInfo.name} />
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
                {artistTracks.map((track, i) => {
                  let artist = [];
                  track.album.artists.forEach((art) => artist.push(art.name));
                  return (
                    <div className="track" id={track.uri} key={track.id}>
                      <div className="left">
                        <p>{i + 1}</p>
                        <div className="image">
                          <img
                            src={track.album.images[2].url}
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
                })}
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
                            src={album.images[2].url}
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
      </section>
    );
};

export default Artist;
