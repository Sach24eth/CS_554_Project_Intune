import React, { useEffect, useState } from "react";
import { loginUrl } from "../../Services/spotify";
import Spotify from "../../images/Spotify_White.png";
import "./user.css";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateSpotifyPlayerState } from "../../Redux/Actions/Player";

const User = ({ connection }) => {
  const history = useNavigate();
  useEffect(() => {
    const authLocalStorage = parseInt(
      window.localStorage.getItem("authentication")
    );

    if (authLocalStorage === 0) {
      history("/auth/login");
    }

    return;
  }, []);
  const auth = getAuth();
  const [user, setUser] = useState({});
  const [userAuth, setUserAuth] = useState([]);
  const dispatch = useDispatch();
  const [isLoggedInWithSpotify, setIsLoggedInWithSpotify] = useState(undefined);
  const userEmail =
    JSON.parse(window.localStorage.getItem("userDetails"))?.email || null;
  window.history.pushState(null, document.title, "/me");

  useEffect(() => {
    let access_token = window.localStorage.getItem("access_token");
    let userLS = window.localStorage.getItem("user");
    userLS = JSON.parse(userLS) || null;
    onAuthStateChanged(auth, (userAuthDetails) => {
      if (userAuthDetails) {
        // console.log("usernamee", userAuthDetails);
        setUserAuth(userAuthDetails);
      }
    });
    if (access_token) {
      setIsLoggedInWithSpotify(true);
      connection(true);
      if (userLS) {
        setUser(userLS);
        return;
      }
      axios
        .post(`${process.env.REACT_APP_API_URL}me`, { access_token })
        .then((res) => {
          dispatch(updateSpotifyPlayerState(true));
          setUser(res.data);
          // Firestore.createUsersInFirestore(
          //   res.data.id,
          //   res.data.displayName,
          //   res.data.email,
          //   res.data.photoURL
          // );
          window.localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch((err) => console.log(err.response));
    } else {
      dispatch(updateSpotifyPlayerState(false));
      connection(false);
      setIsLoggedInWithSpotify(false);
    }
  }, []);

  const disconnectSpotify = (e) => {
    e.preventDefault();

    window.localStorage.removeItem("access_token");
    window.localStorage.removeItem("refresh_token");
    window.localStorage.removeItem("expires_in");
    window.localStorage.removeItem("user");
    dispatch(updateSpotifyPlayerState(false));
    setUser({});
    setIsLoggedInWithSpotify(false);

    window.location.reload();
  };

  return (
    <section id="user">
      <div className="container">
        <div className="header">
          <h1>User Profile</h1>
        </div>
        <div className="details">
          <div className="user">
            <div className="details-container">
              <p className="details-title">Profile Image</p>
              <img
                width={48}
                height={48}
                src={
                  Object.keys(user).length !== 0 && user?.userImage[0]?.url
                    ? user.userImage[0].url
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png"
                }
                alt="Profile"
              />
            </div>
            <div className="details-container">
              <p className="details-title">Display Name</p>
              <input
                type={"text"}
                placeholder="Name"
                value={user.displayName ? user.displayName : "Test"}
                contentEditable={false}
                disabled={true}
              />
            </div>
            <div className="details-container">
              <p className="details-title">Email</p>
              <input
                type={"email"}
                placeholder="Email"
                value={userEmail ? userEmail : "No Email"}
                contentEditable={false}
                disabled={true}
              />
              {/* <a href="/user/1" className="details-extra">
                (Change)
              </a> */}
            </div>
            <div className="details-container">
              <p className="details-title">Spotify Email</p>
              <input
                type={"email"}
                placeholder="Email"
                value={user.email ? user.email : "Not connected to Spotify"}
                contentEditable={false}
                disabled={true}
              />
            </div>
            <div className="details-container">
              <p className="details-title">Account Type</p>
              <input
                type={"text"}
                placeholder="Freemium"
                value={user.accountType ? user.accountType : "Freemium"}
                style={{ textTransform: "capitalize" }}
                contentEditable={false}
                disabled={true}
              />
            </div>
            {userAuth.providerData &&
            userAuth.providerData[0].providerId === "google.com" ? null : (
              <div className="details-container">
                <p className="details-title">Change Password</p>
                <input
                  type={"password"}
                  placeholder="Password"
                  value={"*********************"}
                  contentEditable={false}
                  disabled={true}
                />
                <NavLink to={"/me/forgot-password"} className="details-extra">
                  (Change)
                </NavLink>
              </div>
            )}
          </div>
        </div>
        <div className="integration">
          <div className="header">
            <h1>Spotify Intergration</h1>
          </div>
          {!isLoggedInWithSpotify ? (
            <a href={loginUrl} className="spotify-btn">
              <img src={Spotify} alt="Spotify Logo" width={32} height={32} />
              <span className="text">Login with Spotify</span>
            </a>
          ) : (
            <span className="spotify-btn connected" onClick={disconnectSpotify}>
              <span className="text ">Disconnect Spotify</span>
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default User;
