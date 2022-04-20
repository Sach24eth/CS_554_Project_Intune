import React from "react";
import { Link, NavLink } from "react-router-dom";
import Discord from "../../images/Discord.svg";
import Spotify from "../../images/Spotify.png";
import "./nav.css";
import { loginUrl } from "../../Services/spotify";

const Navbar = ({ auth, username }) => {
  return (
    <header>
      <nav>
        <Link to="/" className="brand">
          <img src={Spotify} width={32} height={32} alt="Spotify Logo" />
          <span className="cross">X</span>
          <img src={Discord} width={32} height={32} alt="Discord Logo" />
        </Link>
        <div className="links">
          {!auth ? (
            <>
              <NavLink to="/auth/signup">Sign Up</NavLink>
              <NavLink to="/auth/login" className="login">
                Log In
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/search">Search</NavLink>
              <NavLink to="/library">Library</NavLink>
              <NavLink to="/playlists">Playlists</NavLink>
              <NavLink to="/me">{username}</NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
