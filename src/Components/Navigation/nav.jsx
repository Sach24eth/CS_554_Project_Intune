import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Discord from "../../images/Discord.svg";
import Spotify from "../../images/Spotify.png";
import "./nav.css";
import { CgMenuRight, CgClose } from "react-icons/cg";

const Navbar = ({ auth, username }) => {
  const [toggleNav, setToggleNav] = useState(false);

  const toggle = () => {
    setToggleNav((prev) => !prev);
  };

  useEffect(() => {
    let height = "250px";
    if (toggleNav) {
      if (!auth) height = "150px";
      document.getElementById("header").style.height = height;
      document.getElementById("links").classList.add("vis");
    } else {
      document.getElementById("header").style.height = "75px";
      document.getElementById("links").classList.remove("vis");
    }
  }, [toggleNav, auth]);

  return (
    <>
      <div className="hamburger" onClick={toggle}>
        {toggleNav ? (
          <CgClose size={20} style={{ color: "white" }} />
        ) : (
          <CgMenuRight style={{ color: "white" }} size={20} />
        )}
      </div>
      <header id="header">
        <nav>
          <Link to="/" className="brand">
            <img src={Spotify} width={32} height={32} alt="Spotify Logo" />
            <span className="cross">X</span>
            <img src={Discord} width={32} height={32} alt="Discord Logo" />
          </Link>

          {/* <div className="mobile-nav" id="mobile-nav">
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
        </div> */}
          <div className="links" id="links">
            {!auth ? (
              <>
                <NavLink to="/auth/signup">Sign Up</NavLink>
                <NavLink to="/auth/login" className="login">
                  Log In
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/home">Home</NavLink>
                <NavLink to="/search">Search</NavLink>
                <NavLink to="/library">Library</NavLink>
                {/* <NavLink to="/playlists">Playlists</NavLink> */}
                <NavLink to="/me">{username}</NavLink>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
