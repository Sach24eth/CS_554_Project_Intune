import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "../Card/Card";

import { NavLink, useNavigate } from "react-router-dom";
import likedSongsImage from "../../images/liked-songs-300.png";
import "./library.css";

const Library = () => {
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState(undefined);
  const [albums, setAlbums] = useState(undefined);
  const [likedSongsCount, setLikedSongsCount] = useState(null);
  const [artists, setArtists] = useState(null);

  let access_token = window.localStorage.getItem("access_token");
  let navigate = useNavigate();

  useEffect(() => {
    const authLocalStorage = parseInt(
      window.localStorage.getItem("authentication")
    );

    if (authLocalStorage === 0) {
      navigate("/auth/login");
    }
  }, []);
  function fetchData() {
    if (access_token) {
      const apiUrl = "https://api.spotify.com/v1";
      const URL_ALBUMS = `${apiUrl}/me/albums`;
      const URL_USER_PlAYLISTS = `${apiUrl}/me/playlists`;
      const URL_USER_LIKED_SONGS = `${apiUrl}/me/tracks`;
      const URL_USER_FOLLOWING = `${apiUrl}/me/following?type=artist`;

      setLoading(true);

      axios
        .get(URL_USER_LIKED_SONGS, {
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setLikedSongsCount(res.data.total);
        })
        .catch((e) => console.log(e.response));

      axios
        .get(URL_USER_PlAYLISTS, {
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          setPlaylists(res.data.items);
        })
        .catch((e) => console.log(e.response));

      axios
        .get(URL_USER_FOLLOWING, {
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          setArtists(res.data.artists.items);
        })
        .catch((e) => console.log(e.response));

      axios
        .get(URL_ALBUMS, {
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
          setAlbums(res.data.items);
          setLoading(false);
        })
        .catch((e) => console.log(e.response));
    }
  }

  useEffect(() => {
    if (access_token) fetchData();
    else setLoading(false);
  }, [access_token]);

  const redirToPlaylist = (e) => {
    const albumId = e.target.parentNode.parentNode.id;
    navigate("/playlist?id=" + albumId.split(":")[2]);
  };

  const redirToAlbum = (e) => {
    const albumId = e.target.parentNode.parentNode.id;
    navigate("/album?id=" + albumId.split(":")[2]);
  };

  const redirToArtist = (e) => {
    const albumId = e.target.id;
    navigate("/artist?id=" + albumId.split(":")[2]);
  };

  const redirToTracks = () => {
    navigate("/liked-songs");
  };

  if (loading) {
    return (
      <section id="library">
        <div className="container">
          <h1 className="header">Loading...</h1>
        </div>
      </section>
    );
  }

  if (!access_token && !loading) {
    return (
      <section id="library">
        <div className="container">
          <h1 className="header">Library</h1>
          <p className="err-text">You are Not Connected to Spotify</p>
          <NavLink to={"/me"} className="connect">
            Connect to Spotify
          </NavLink>
        </div>
      </section>
    );
  }

  return (
    <section id="library">
      <div className="container">
        <h1 className="header">Library</h1>

        {likedSongsCount && (
          <>
            <p className="title">Liked Songs</p>
            <div className="card-list" id="albums">
              <Card
                id={"liked-songs"}
                heading={`${likedSongsCount} Liked Songs`}
                image={likedSongsImage}
                albumId={"playlist.id"}
                albumRedir={redirToTracks}
              />
            </div>
          </>
        )}

        <p className="title">Playlist</p>
        <div className="card-list" id="albums">
          {playlists &&
            playlists.map((playlist) => {
              return (
                <Card
                  key={playlist.id}
                  id={playlist.id}
                  heading={playlist.name}
                  image={playlist.images[0].url}
                  // clickHandler={this.props.onPlaySong}
                  uri={playlist.uri}
                  albumId={playlist.id}
                  albumRedir={redirToPlaylist}
                />
              );
            })}
        </div>

        <p className="title">Artists</p>
        <div className="card-list" id="albums">
          {artists &&
            artists.map((artist) => {
              return (
                <Card
                  key={artist.id}
                  id={artist.id}
                  heading={artist.name}
                  image={artist.images[0].url}
                  uri={artist.uri}
                  clickHandler={redirToArtist}
                />
              );
            })}
        </div>

        <p className="title">Albums</p>
        <div className="card-list" id="albums">
          {albums &&
            albums.map((album) => {
              return (
                <Card
                  key={album.album.id}
                  id={album.album.id}
                  heading={album.album.name}
                  image={album.album.images[0].url}
                  // clickHandler={this.props.onPlaySong}
                  uri={album.album.uri}
                  albumId={album.album.id}
                  albumRedir={redirToAlbum}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Library;
