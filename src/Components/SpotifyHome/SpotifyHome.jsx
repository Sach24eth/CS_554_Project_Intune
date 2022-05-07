import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard/Dashboard";
import "./spotify.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const firestore = require("../../Firebase/Firestore");

const SpotifyHome = ({ greeting, username }) => {
  const auth = getAuth();
  const [templateToLoad, setTemplateToLoad] = useState(undefined);
  const history = useNavigate();
  useEffect(() => {
    async function getGenre() {
      let id = null;
      onAuthStateChanged(auth, (user) => {
        if (user) {
          id = user.uid;
          console.log("user id", user.uid);
        }
      });
      if (id) {
        firestore
          .getGenreData(id)
          .then((res) => {
            console.log(res);
            if (!res.hasData) history("/genres");
          })
          .catch((err) => console.log(err));
      }
    }

    getGenre();
  }, [history, auth]);

  useEffect(() => {
    setTemplateToLoad(
      <Dashboard
        onClickCard={onClickCard}
        username={username}
        greeting={greeting}
        history={history}
      />
    );
  }, [greeting, username, history]);

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
