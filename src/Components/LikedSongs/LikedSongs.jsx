import axios from "axios";
import React, { Component } from "react";
import { Table } from "../Table/table";
import likedSongsImage from '../../images/liked-songs-300.png'
import "./likedsongs.css";

class LikedSongs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: "",
            access_token: "",
            playlist: null,
            loading: true,
        };
    }

    componentDidMount() {
        const id = new URLSearchParams(window.location.search).get("id");
        const access_token = window.localStorage.getItem("access_token");
        this.setState({
            id: id,
            access_token: access_token,
            playlist: null,
        });

        const URL_ALBUM = `https://api.spotify.com/v1/me/tracks`;

        axios
            .get(URL_ALBUM, {
                headers: {
                    Authorization: "Bearer " + access_token,
                    "Content-Type": "application/json",
                },
                params: {
                    limit: 25
                },
            })
            .then((res) => {
                this.setState({playlist: res.data, loading: false});
                console.log(res.data)
            })
            .catch((e) => {
                console.log(e.response)
            });
    }

    millisToMinutesAndSeconds(millis) {
        var minutes = Math.floor(millis / 60000);
        var seconds = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }

    render() {
        console.log(this.state);
        return (
            <section id="album-page">
                <div className="container">
                    {this.state.loading ? (
                        <h1>Loading Data...</h1>
                    ) : (
                        <div className="playlist">
                            <div className="playlist-info">
                                <img
                                    width={200}
                                    height={200}
                                    src={likedSongsImage}
                                    // alt={this.state.playlist.name}
                                />
                                <div className="playlist-container">
                                    <h1>Liked Songs</h1>
                                </div>
                            </div>
                            <div className="playlist-tracks">
                                {this.state.playlist.items &&
                                this.state.playlist.items.map((track, i) => {
                                    return (
                                        <Table
                                            key={i}
                                            track={track}
                                            i={i}
                                            fn={this.millisToMinutesAndSeconds}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        );
    }
}

export default LikedSongs;
