import React, {useEffect, useState} from "react";
import axios from "axios";
import Card from "../Card/Card";
import {useNavigate} from "react-router-dom";
import likedSongsImage from '../../images/liked-songs-300.png';

const Library = () => {

    const [isLoggedInWithSpotify, setIsLoggedInWithSpotify] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [playlists, setPlaylists] = useState(undefined);
    const [albums, setAlbums] = useState(undefined);
    const [display, setDisplay] = useState(undefined);
    const [likedSongs, setLikedSongs] = useState(null);
    let card = null;
    let access_token = window.localStorage.getItem("access_token");;

    function fetchData() {
        if (access_token){
            const apiUrl = "https://api.spotify.com/v1";
            const URL_ALBUMS = `${apiUrl}/me/albums`;
            const URL_USER_PlAYLISTS = `${apiUrl}/me/playlists`;
            const URL_USER_LIKED_SONGS = `${apiUrl}/me/tracks`;

            setLoading(true)

            axios
                .get(URL_USER_LIKED_SONGS, {
                    headers: {
                        Authorization: "Bearer " + access_token,
                        "Content-Type": "application/json",
                    }
                })
                .then(res => {
                    console.log(res.data);
                    setLikedSongs(res.data.total);
                })
                .catch((e) => console.log(e.response));

            axios
                .get(URL_USER_PlAYLISTS, {
                    headers: {
                        Authorization: "Bearer " + access_token,
                        "Content-Type": "application/json",
                    }
                })
                .then(res => {
                    // console.log(res.data);
                    setPlaylists(res.data.items);
                    // setLoading(false)
                })
                .catch((e) => console.log(e.response));

            axios
                .get(URL_ALBUMS, {
                    headers: {
                        Authorization: "Bearer " + access_token,
                        "Content-Type": "application/json",
                    }
                })
                .then(res => {
                    console.log(res.data);
                    setAlbums(res.data.items);
                    setLoading(false)
                })
                .catch((e) => console.log(e.response));
        }
    }

    useEffect(() => {

        fetchData()
    }, [access_token])



    const redirToPlaylist = (e) => {
        const albumId = e.target.parentNode.parentNode.id;
        window.location.href = "/playlist?id=" + albumId.split(":")[2];
    };

    const redirToAlbum = (e) => {
        const albumId = e.target.parentNode.parentNode.id;
        window.location.href = "/album?id=" + albumId.split(":")[2];
    };

    const redirToTracks = () => {
        console.log('hee')
        window.location.href = "/liked-songs";
    };

    if (!loading) {
        console.log(albums)
        return (
            <section id="library">
                <div className="container">
                    <div className="header">
                        <h1>Library</h1>

                        {likedSongs &&
                        <div>
                            <h3>Liked Songs</h3>
                            <div className="card-list" id="albums">

                                <Card
                                    // key={'likedsongs'}
                                    id={'liked-songs'}
                                    heading={`${likedSongs} Liked Songs`}
                                    image={likedSongsImage}
                                    // clickHandler={this.props.onPlaySong}
                                    // uri={'sss'}
                                    albumId={'playlist.id'}
                                    albumRedir={redirToTracks}
                                />
                            </div>
                        </div>
                        }



                        <h3>Playlist</h3>
                        <div className="card-list" id="albums">
                            {playlists && playlists.map((playlist) => {
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

                        <h3>Albums</h3>
                        <div className="card-list" id="albums">
                            {albums && albums.map((album) => {
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
                </div>
            </section>
        );
    }
    else {
        return (
            <section id="library">
                <div className="container">
                    <div className="header">
                        <h1>Library</h1>

                    </div>
                </div>
            </section>
        );
    }



};

export default Library;
