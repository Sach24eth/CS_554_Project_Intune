import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./search.css";

const Search = () => {
  const access_token = window.localStorage.getItem("access_token");
  const genricToken = window.localStorage.getItem("token");
  const [search, setSearch] = useState(undefined);
  const [searchTracks, setsearchTracks] = useState(null);
  const [searchAlbums, setSearchAlbums] = useState(null);
  const [searchPlaylist, setSearchPlaylist] = useState(null);
  const [searchArtists, setSearchArtists] = useState(null);
  const [noSearchResult, setNoSearchResult] = useState(null);

  let limit = 10;

  useEffect(() => {
    if (!search) return;
    if (!genricToken) return;

    let cancel = false;
    const apiUrl = "https://api.spotify.com/v1";
    const SEARCH = `${apiUrl}/search?q=${search}&type=track%2Cartist%2Calbum%2Cplaylist`;

    axios
      .get(SEARCH, {
        headers: {
          Authorization: "Bearer " + genricToken,
          "Content-Type": "application/json",
        },
        params: {
          limit: limit,
        },
      })
      .then((res) => {

        setNoSearchResult(
            !res.data["tracks"].total && !res.data["tracks"].total &&
            !res.data["tracks"].total && !res.data["tracks"].total ? true: null
        )

        setsearchTracks( res.data["tracks"].total ?
          res.data["tracks"].items.map((track) => {
            return {
              title: track.name,
              image: track.album.images[0].url,
              artists: track.artists
                .map((artist) => {
                  return artist.name;
                })
                .join(","),
              uri: track.uri,
            };
          }) : null
        );

        setSearchAlbums( res.data["albums"].total ?
          res.data["albums"].items.map((album) => {
            return {
              id: album.id,
              title: album.name,
              image: album.images[0].url,
              artists: album.artists
                .map((artist) => {
                  return artist.name;
                })
                .join(","),
              uri: album.uri,
            };
          }) : null
        );

        setSearchArtists( res.data["artists"].total ?
          res.data["artists"].items.map((artist) => {
            return {
              id: artist.id,
              name: artist.name,
              image: artist.images[0].url,
              uri: artist.uri,
            };
          }) : null
        );

        setSearchPlaylist( res.data["playlists"].total ?
          res.data["playlists"].items.map((playlist) => {
            return {
              id: playlist.id,
              title: playlist.name,
              image: playlist.images[0].url,
              owner: playlist.owner.display_name,
              uri: playlist.uri,
            };
          }) : null
        );
      })
      .catch((e) => console.log(e.response));

    return () => (cancel = true);
  }, [search, access_token, limit]);

  const playSong = (uri) => {
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
      .catch((e) => console.log(e.response));
  };


  return (
    <section id="search">
      <div className="container">
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
          {noSearchResult && <h2 className="title">Sorry, No Results Found !</h2>}
        </div>

        <div className="small-cont">
          <div id="tracks-result">
            {searchTracks && <h2 className="title">Tracks</h2>}
            {searchTracks &&
              searchTracks.map((track) => {
                return (
                  <div
                    className="search-card"
                    onClick={() => {
                      playSong(track.uri);
                    }}
                  >
                    <img
                      src={track.image}
                      alt={track.name}
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
            {searchAlbums && <h2 className="title">Albums</h2>}
            {searchAlbums &&
              searchAlbums.map((album) => {
                return (
                  <Link className="search-card" to={`/album?id=${album.id}`}>
                    <img
                      src={album.image}
                      alt={album.name}
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
            {searchArtists && <h2 className="title">Artists</h2>}
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
            {searchPlaylist && <h2 className="title">Playlists</h2>}
            {searchPlaylist &&
              searchPlaylist.map((playlist) => {
                return (
                  <Link
                    className="search-card"
                    to={`/playlist?id=${playlist.id}`}
                  >
                    <img
                      src={playlist.image}
                      style={{ height: "64px", width: "64px" }}
                      alt={playlist.name}
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
