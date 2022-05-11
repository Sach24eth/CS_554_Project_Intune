import axios from "axios";
import React, { Component } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Table } from "../Table/table";
import "./playlist.css";

class Playlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      access_token: "",
      playlist: null,
      loading: true,
      err: false,
    };
  }

  componentDidMount() {
    const id = new URLSearchParams(window.location.search).get("id");
    const user_access_token =
      window.localStorage.getItem("access_token") || null;
    const genricToken = window.localStorage.getItem("token");
    const token = user_access_token ? user_access_token : genricToken;
    this.setState({
      id: id,
      access_token: token,
      playlist: null,
    });

    const URL_ALBUM = `https://api.spotify.com/v1/playlists/${id}`;

    axios
      .get(URL_ALBUM, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => this.setState({ playlist: res.data, loading: false }))
      .catch((e) => this.setState({ err: true }));
  }

  millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  render() {
    return (
      <section id="album-page">
        <ToastContainer />
        {this.state.err ? (
          <div className="container">
            <h1>Error loading playlist</h1>
          </div>
        ) : (
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
                    <p className="type">{this.state.playlist.type}</p>
                    <h1>{this.state.playlist.name}</h1>
                  </div>
                </div>
                <div className="playlist-tracks">
                  {this.state.playlist.tracks &&
                    this.state.playlist.tracks.items.map((track, i) => {
                      return (
                        <Table
                          key={i}
                          track={track}
                          i={i}
                          playlist={this.state.playlist}
                          fn={this.millisToMinutesAndSeconds}
                          token={
                            window.localStorage.getItem("access_token") || null
                          }
                        />
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    );
  }
}

export default Playlist;
