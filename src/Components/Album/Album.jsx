import axios from "axios";
import React, { Component } from "react";
import { AlbumTable } from "../Table/AlbumTable";
import "./album.css";

class Album extends Component {
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

        const URL_ALBUM = `https://api.spotify.com/v1/albums/${id}`;

        axios
            .get(URL_ALBUM, {
                headers: {
                    Authorization: "Bearer " + access_token,
                    "Content-Type": "application/json",
                },
            })
            .then((res) => {
                this.setState({playlist: res.data, loading: false})
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
                                    src={this.state.playlist.images[0].url}
                                    alt={this.state.playlist.name}
                                />
                                <div className="playlist-container">
                                    <h1>{this.state.playlist.name}</h1>
                                    {/* <p className="description">
                    {this.state.playlist.description}
                  </p> */}
                                    {/* <p className="followers">
                    Followers: {this.state.playlist.followers.total}
                  </p> */}
                                </div>
                            </div>
                            <div className="playlist-tracks">
                                {this.state.playlist.tracks &&
                                this.state.playlist.tracks.items.map((track, i) => {
                                    return (
                                        <AlbumTable
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

export default Album;
