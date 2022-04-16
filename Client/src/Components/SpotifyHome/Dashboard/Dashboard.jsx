import React, { Component } from "react";
import axios from "axios";
import Card from "../../Card/Card";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      categories: [],
      songs: [],
      followings: [],
      playlist: [],
      loading: true,
      user_access_token: null,
      generic_token: null,
      greeting: this.props.greeting,
      username: this.props.username,
      id: null,
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const userToken = window.localStorage.getItem("access_token");
    const genricToken = window.localStorage.getItem("token");
    const user = window.localStorage.getItem("user") || null;
    if (user) this.setState((prev) => ({ id: JSON.parse(user).id }));
    if (userToken)
      this.setState((prev) => ({
        user_access_token: userToken,
      }));

    if (genricToken) {
      this.setState((prev) => ({
        generic_token: genricToken,
      }));
    }

    this.fetchData(genricToken, userToken);
  }

  fetchData(genricToken, user_access_token) {
    const apiUrl = "https://api.spotify.com/v1";
    const URL_RELEASES = `${apiUrl}/browse/new-releases?country=IN`;
    const URL_CATEGORY = `${apiUrl}/browse/categories`;
    const URL_USER_TOP = `${apiUrl}/me/top/tracks`;
    const URL_USER_FOLLOWING = `${apiUrl}/me/following?type=artist`;

    axios
      .get(URL_RELEASES, {
        headers: {
          Authorization: "Bearer " + genricToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        this.setState({
          albums: res.data.albums.items,
        });
      })
      .catch((e) => console.log(e.response));

    if (user_access_token) {
      axios
        .get(URL_USER_TOP, {
          headers: {
            Authorization: "Bearer " + user_access_token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data.items);
          this.setState({
            songs: res.data.items,
          });
        })
        .catch((e) => console.log(e.response));

      axios
        .get(URL_USER_FOLLOWING, {
          headers: {
            Authorization: "Bearer " + user_access_token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data.artists);
          this.setState({
            followings: res.data.artists.items,
          });
        })
        .catch((e) => console.log(e.response));
      const user = window.localStorage.getItem("user") || null;
      let id;
      if (user) id = JSON.parse(user).id;
      const URL_USER_PLAYLIST = `${apiUrl}/users/${id}/playlists`;

      axios
        .get(URL_USER_PLAYLIST, {
          headers: {
            Authorization: "Bearer " + user_access_token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          this.setState({
            playlist: res.data.items,
          });
        })
        .catch((e) => console.log(e.response));
    }

    axios
      .get(URL_CATEGORY, {
        headers: {
          Authorization: "Bearer " + genricToken,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        this.setState({
          categories: res.data.categories.items,
        });
      })
      .catch((e) => console.log(e.response));
  }

  render() {
    return (
      <>
        <div className="greeting">
          {this.props.greeting}, {this.props.username}!
        </div>
        <div className="new">
          <h1 className="header">New Releases</h1>
          <div className="card-list" id="albums">
            {this.state.albums &&
              this.state.albums.map((album) => {
                return (
                  <Card
                    key={album.id}
                    heading={album.name}
                    image={album.images[1].url}
                    clickHandler={this.props.onPlaySong}
                    uri={album.uri}
                  />
                );
              })}
          </div>
        </div>
        {this.state.user_access_token ? (
          <div className="new">
            <h1 className="header">Playlist</h1>
            <div className="card-list" id="playlist">
              {this.state.playlist &&
                this.state.playlist.map((playlist) => {
                  return (
                    <Card
                      key={playlist.id}
                      id={playlist.id}
                      heading={playlist.name}
                      image={playlist.images[0].url}
                      clickHandler={this.props.onPlaySong}
                      uri={playlist.uri}
                    />
                  );
                })}
            </div>
          </div>
        ) : (
          ""
        )}
        {this.state.user_access_token ? (
          <div className="new">
            <h1 className="header">Top 20 Most Played</h1>
            <div className="card-list" id="categories">
              {this.state.songs &&
                this.state.songs.map((songs) => {
                  return (
                    <Card
                      key={songs.id}
                      id={songs.id}
                      heading={songs.name}
                      image={songs.album.images[1].url}
                      clickHandler={this.props.onPlaySong}
                      uri={songs.uri}
                    />
                  );
                })}
            </div>
          </div>
        ) : (
          ""
        )}
        {this.state.user_access_token ? (
          <div className="new">
            <h1 className="header">Following</h1>
            <div className="card-list" id="categories">
              {this.state.followings &&
                this.state.followings.map((follow) => {
                  return (
                    <Card
                      key={follow.id}
                      id={follow.id}
                      heading={follow.name}
                      image={follow.images[1].url}
                      // clickHandler={this.props.onPlaySong}
                      uri={follow.uri}
                    />
                  );
                })}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="new">
          <h1 className="header">Categories</h1>
          <div className="card-list" id="categories">
            {this.state.categories &&
              this.state.categories.map((category) => {
                return (
                  <Card
                    key={category.id}
                    id={category.id}
                    heading={category.name}
                    image={category.icons[0].url}
                    clickHandler={this.props.onClickCard}
                  />
                );
              })}
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;
