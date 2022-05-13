import React from "react";
import { NavLink } from "react-router-dom";
import Spotify from "../../images/Spotify_Full.png";
import "./navbar.css";

const Navbar = ({ auth }) => {
  const authState =
    JSON.parse(window.localStorage.getItem("userDetails")) || undefined;
  const username = authState?.displayName || "User";

  const toggleNav = (e) => {
    const navbarLinks = document.getElementsByClassName("navbar-links")[0];
    navbarLinks.classList.toggle("active");
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <NavLink to="/" className="brand">
          <img src={Spotify} height={32} alt="Spotify Logo" />
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
            <li onClick={toggleNav}>
              <NavLink to="/home">Home</NavLink>
            </li>
            <li onClick={toggleNav}>
              <NavLink to="/search">Search</NavLink>
            </li>
            <li onClick={toggleNav}>
              <NavLink to="/library">Library</NavLink>
            </li>
            <li>
              <NavLink to="/messages">Chatrooms</NavLink>
            </li>
            <li onClick={toggleNav}>
              <NavLink to="/me">{username}</NavLink>
            </li>
            <li onClick={toggleNav}>
              <NavLink to="/auth/logout">Logout</NavLink>
            </li>
          </ul>
        ) : (
          <ul>
            <li onClick={toggleNav}>
              <NavLink to="/auth/signup">Sign Up</NavLink>
            </li>
            <li onClick={toggleNav}>
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
