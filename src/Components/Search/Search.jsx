import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { storePrevSearchRes } from "../../Redux/Actions/Search";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

import "./search.css";
import noImageAvailable from "../../images/no-image-available.jpg";

const Search = () => {
  const searchRedux = useSelector((state) => state.searchResults);
  const dispatch = useDispatch();

  const [search, setSearch] = useState(undefined);
  const [searchTracks, setSearchTracks] = useState(null);
  const [searchAlbums, setSearchAlbums] = useState(null);
  const [searchPlaylist, setSearchPlaylist] = useState(null);
  const [searchArtists, setSearchArtists] = useState(null);
  const [noSearchResult, setNoSearchResult] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const SEARCH_LIMIT = 10;

  useEffect(() => {
    if (searchRedux) {
      setSearchTracks(searchRedux.tracks);
      setSearchAlbums(searchRedux.album);
      setSearchArtists(searchRedux.artist);
      setSearchPlaylist(searchRedux.playlist);
    }
  }, []);

  useEffect(() => {
    const user_access_token =
      window.localStorage.getItem("access_token") || null;
    const genricToken = window.localStorage.getItem("token");
    const token = user_access_token ? user_access_token : genricToken;

    if (!search) return;
    if (!token) {
      setError("Error 500: Internal Server Error");
      return;
    }

    let cancel = false;
    const apiUrl = "https://api.spotify.com/v1";
    const type = ["track", "artist", "album", "playlist"].join("%2C");
    const SEARCH = `${apiUrl}/search?q=${search}&type=${type}`;

    /* Clear results while searching */
    setSearchPlaylist(null);
    setSearchAlbums(null);
    setSearchTracks(null);
    setSearchArtists(null);
    setError(null);
    setLoading(true);

    axios
      .get(SEARCH, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        params: {
          limit: SEARCH_LIMIT,
        },
      })
      .then((res) => {
        setLoading(null);
        setNoSearchResult(
          !res.data["tracks"].total &&
            !res.data["albums"].total &&
            !res.data["artists"].total &&
            !res.data["playlists"].total
            ? true
            : null
        );

        const tracks = res.data["tracks"].total
          ? res.data["tracks"].items.map((track) => {
              return {
                title: track.name,
                image: track.album.images.length
                  ? track.album.images[0].url
                  : noImageAvailable,
                artists: track.artists
                  .map((artist) => {
                    return artist.name;
                  })
                  .join(","),
                uri: track.uri,
              };
            })
          : null;

        const album = res.data["albums"].total
          ? res.data["albums"].items.map((album) => {
              return {
                id: album.id,
                title: album.name,
                image: album.images.length
                  ? album.images[0].url
                  : noImageAvailable,
                artists: album.artists
                  .map((artist) => {
                    return artist.name;
                  })
                  .join(","),
                uri: album.uri,
              };
            })
          : null;

        const artist = res.data["artists"].total
          ? res.data["artists"].items.map((artist) => {
              return {
                id: artist.id,
                name: artist.name,
                image: artist.images.length
                  ? artist.images[0].url
                  : noImageAvailable,
                uri: artist.uri,
              };
            })
          : null;

        const playlist = res.data["playlists"].total
          ? res.data["playlists"].items.map((playlist) => {
              return {
                id: playlist.id,
                title: playlist.name,
                image: playlist.images.length
                  ? playlist.images[0].url
                  : noImageAvailable,
                owner: playlist.owner.display_name,
                uri: playlist.uri,
              };
            })
          : null;

        setSearchTracks((prev) => tracks);
        setSearchAlbums((prev) => album);
        setSearchArtists((prev) => artist);
        setSearchPlaylist((prev) => playlist);

        dispatch(
          storePrevSearchRes({
            tracks,
            album,
            artist,
            playlist,
          })
        );
      })
      .catch((e) => {
        console.log(e);
        setLoading(null);

        if (e.response) {
          setError(
            `Error ${e.response.data.error.status}: ${e.response.data.error.message}`
          );
          return;
        }
        setError("Error 500: Internal Server Error");
      });

    return () => (cancel = true);
  }, [search]);

  const playSong = (uri) => {
    const access_token = window.localStorage.getItem("access_token");
    if (!access_token) return toast.error("Connect to Spotify to Play Song");

    const deviceId = window.localStorage.getItem("deviceId");
    const apiUrl = "https://api.spotify.com/v1";
    const URL_PLAY = `${apiUrl}/me/player/play?device_id=${deviceId}`;

    axios
      .put(
        URL_PLAY,
        {
          uris: [uri],
        },
        {
          headers: {
            Authorization: "Bearer " + access_token,
            "Content-Type": "application/json",
          },
        }
      )
      .catch((e) => {
        console.log(e.response);
      });
  };

  return (
    <section id="search">
      <div className="container">
        <Link to={"/me"}>
          <ToastContainer />
        </Link>
        <div className="search-box">
          <label>
            <input
              type="text"
              placeholder="Search tracks, album, artists and playlist"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        <div className="small-cont" id="no-results-found">
          {loading && <h1 className="title">Loading ...</h1>}
        </div>

        <div className="small-cont" id="no-results-found">
          {error && <h1 className="title">{error}</h1>}
        </div>

        <div className="small-cont" id="no-results-found">
          {noSearchResult && !loading && !error && (
            <h2 className="title">Sorry, No Results Found !</h2>
          )}
        </div>

        <div className="small-cont">
          <div id="tracks-result">
            {searchTracks && <h1 className="title">Tracks</h1>}
            {searchTracks &&
              searchTracks.map((track) => {
                console.log(track);
                return (
                  <div
                    className="search-card"
                    onClick={() => {
                      playSong(track.uri);
                    }}
                  >
                    <img
                      src={track.image}
                      alt={track.title}
                      style={{ height: "64px", width: "64px" }}
                    />
                    <div className="info">
                      <div className="track-title">{track.title}</div>
                      <div className="text-muted">{track.artists}</div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div id="albums-result">
            {searchAlbums && <h1 className="title">Albums</h1>}
            {searchAlbums &&
              searchAlbums.map((album) => {
                return (
                  <Link className="search-card" to={`/album?id=${album.id}`}>
                    <img
                      src={album.image}
                      alt={album.title}
                      style={{ height: "64px", width: "64px" }}
                    />
                    <div className="info">
                      <div className="track-title">{album.title}</div>
                      <div className="text-muted">{album.artists}</div>
                    </div>
                  </Link>
                );
              })}
          </div>
          <div id="artists-result">
            {searchArtists && <h1 className="title">Artists</h1>}
            {searchArtists &&
              searchArtists.map((artist) => {
                return (
                  <Link className="search-card" to={`/artist?id=${artist.id}`}>
                    <img
                      src={artist.image}
                      alt={artist.name}
                      style={{ height: "64px", width: "64px" }}
                    />
                    <div className="info">
                      <div className="track-title">{artist.name}</div>
                    </div>
                  </Link>
                );
              })}
          </div>
          <div id="playlist-result">
            {searchPlaylist && <h1 className="title">Playlists</h1>}
            {searchPlaylist &&
              searchPlaylist.map((playlist) => {
                console.log(playlist);
                return (
                  <Link
                    className="search-card"
                    to={`/playlist?id=${playlist.id}`}
                  >
                    <img
                      src={playlist.image}
                      style={{ height: "64px", width: "64px" }}
                      alt={playlist.title}
                    />
                    <div className="info">
                      <div className="track-title">{playlist.title}</div>
                      <div className="text-muted">{playlist.owner}</div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Search;
