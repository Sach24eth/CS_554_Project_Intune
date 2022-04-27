import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Discord from "../../images/Discord.svg";
import Spotify from "../../images/Spotify.png";
import "./navbar.css";

const Navbar = ({ auth }) => {
  const authState = useSelector((state) => state.auth);
  // console.log(authState);
  // const isAuthenticated = authState?.isLoggedIn;
  const username = authState.displayName || "User";
  // const [auth, setAuth] = useState(false);

  // useEffect(() => {
  //   console.log("Auth: " + isAuthenticated);
  //   if (isAuthenticated) setAuth(true);
  //   else setAuth(false);
  // }, [authState, isAuthenticated]);

  const toggleNav = (e) => {
    const navbarLinks = document.getElementsByClassName("navbar-links")[0];
    navbarLinks.classList.toggle("active");
  };
  return (
    <nav className="navbar">
      <div className="brand">
        <NavLink to="/" className="brand">
          <img src={Spotify} width={32} height={32} alt="Spotify Logo" />
          <span className="cross">X</span>
          <img src={Discord} width={32} height={32} alt="Discord Logo" />
        </NavLink>
      </div>
      <div className="toggle-button" onClick={toggleNav}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
      <div className="navbar-links">
        {auth ? (
          <ul>
            <li>
              <NavLink to="/home">Home</NavLink>
            </li>
            <li>
              <NavLink to="/search">Search</NavLink>
            </li>
            <li>
              <NavLink to="/library">Library</NavLink>
            </li>
            <li>
              <NavLink to="/playlists">Playlists</NavLink>
            </li>
            <li>
              <NavLink to="/me">{username}</NavLink>
            </li>
            <li>
              <NavLink to="/auth/logout">Logout</NavLink>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <NavLink to="/auth/signup">Sign Up</NavLink>
            </li>
            <li>
              <NavLink to="/auth/login" className="login">
                Login
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
