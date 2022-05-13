import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import axios from "axios";

import Card from "../Card/Card";
import likedSongsImage from "../../images/liked-songs-300.png";
import noImageAvailable from "../../images/no-image-available.jpg";

import "./library.css";


const Library = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [likedSongsCount, setLikedSongsCount] = useState(null);
  const [artists, setArtists] = useState(null);

  let access_token = window.localStorage.getItem("access_token");
  let navigate = useNavigate();


  function fetchData() {
    if (access_token) {
      const apiUrl = "https://api.spotify.com/v1";
      const URL_ALBUMS = `${apiUrl}/me/albums`;
      const URL_USER_PlAYLISTS = `${apiUrl}/me/playlists`;
      const URL_USER_LIKED_SONGS = `${apiUrl}/me/tracks`;
      const URL_USER_FOLLOWING = `${apiUrl}/me/following?type=artist`;

      setError(false);
      setLoading(true);

      axios
        .get(URL_USER_LIKED_SONGS, {
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setLikedSongsCount(res.data.total ? res.data.total : null);
        })
        .catch((e) => {
          setLoading(false)
          setError(e.response ?
              `Error ${e.response.data.error.status}: ${e.response.data.error.message}`
              : "Error 500: Internal Server Error"
          );
          console.log(e)
        });


      axios
        .get(URL_USER_PlAYLISTS, {
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {

          setPlaylists(res.data.total ? res.data.items.map((playlist) => {
            return {
              id: playlist.id,
              title: playlist.name,
              image: playlist.images.length ? playlist.images[0].url : noImageAvailable,
              owner: playlist.owner.display_name,
              uri: playlist.uri,
            }
          }): null);
        })
        .catch((e) => {
          setLoading(false)
          setError(e.response ?
              `Error ${e.response.data.error.status}: ${e.response.data.error.message}`
              : "Error 500: Internal Server Error"
          );
          console.log(e)
        });

      axios
        .get(URL_USER_FOLLOWING, {
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {

          setArtists(res.data.artists.total ? res.data.artists.items.map((artist) => {
            return {
              id: artist.id,
              name: artist.name,
              image: artist.images.length ? artist.images[0].url : noImageAvailable,
              uri: artist.uri,
            };
          }) : null);

        })
        .catch((e) => {
          setLoading(false)
          setError(e.response ?
              `Error ${e.response.data.error.status}: ${e.response.data.error.message}`
              : "Error 500: Internal Server Error"
          );
          console.log(e)
        });

      axios
        .get(URL_ALBUMS, {
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {

          setAlbums(res.data.total ? res.data.items.map((album) => {
            return {
              id: album.album.id,
              title: album.album.name,
              image: album.album.images.length ? album.album.images[0].url : noImageAvailable,
              artists: album.album.artists
                  .map((artist) => {
                    return artist.name;
                  })
                  .join(","),
              uri: album.album.uri,
            };
          }) : null);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false)
          setError(e.response ?
              `Error ${e.response.data.error.status}: ${e.response.data.error.message}`
              : "Error 500: Internal Server Error"
          );
          console.log(e)
        });
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

  if (error) {
    return (
        <section id="library">
          <div className="container">
            <h1 className="header">{error}</h1>
          </div>
        </section>
    );
  }

  if (!likedSongsCount && !artists && !playlists && !albums && !error) {
    return (
        <section id="library">
          <div className="container">
            <h1 className="header">Library</h1>
            <p className="err-text">Your Library is Empty</p>
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
              <div id="liked-songs">
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
              </div>
          )}

          {playlists && <p className="title">Playlist</p>}
          <div className="card-list" id="albums">
            {playlists &&
            playlists.map((playlist) => {
              return (
                  <Card
                      key={playlist.id}
                      id={playlist.id}
                      heading={playlist.title}
                      image={playlist.image}
                      // clickHandler={this.props.onPlaySong}
                      uri={playlist.uri}
                      albumId={playlist.id}
                      albumRedir={redirToPlaylist}
                  />
              );
            })}
          </div>

          {artists && <p className="title">Artists</p>}
          <div className="card-list" id="albums">
            {artists &&
            artists.map((artist) => {
              return (
                  <Card
                      key={artist.id}
                      id={artist.id}
                      heading={artist.name}
                      image={artist.image}
                      uri={artist.uri}
                      clickHandler={redirToArtist}
                  />
              );
            })}
          </div>

          {albums && <p className="title">Albums</p>}
          <div className="card-list" id="albums">
            {albums &&
            albums.map((album) => {
              return (
                  <Card
                      key={album.id}
                      id={album.id}
                      heading={album.name}
                      image={album.image}
                      // clickHandler={this.props.onPlaySong}
                      uri={album.uri}
                      albumId={album.id}
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
