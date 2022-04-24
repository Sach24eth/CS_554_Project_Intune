import axios from "axios";
import React, { useEffect, useState } from "react";
import Dashboard from "./Dashboard/Dashboard";
import "./spotify.css";

const SpotifyHome = ({ greeting, username }) => {
  const [templateToLoad, setTemplateToLoad] = useState(undefined);

  useEffect(() => {
    setTemplateToLoad(
      <Dashboard
        onClickCard={onClickCard}
        username={username}
        greeting={greeting}
      />
    );
  }, [greeting, username]);

  const onClickCard = (e) => {
    e.preventDefault();
    console.log(e.target.parentNode.parentNode.k);
  };

  return (
    <>
      <section id="spotify-home">
        <div className="container">{templateToLoad}</div>
      </section>
    </>
  );
};

export default SpotifyHome;
