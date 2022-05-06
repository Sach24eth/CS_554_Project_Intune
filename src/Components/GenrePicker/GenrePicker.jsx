import React, { useState, useEffect } from "react";
import "./gpicker.css";
import axios from "axios";
import Picker from "./Picker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Spinner from "../Spinner";
const Firestore = require("../../Firebase/Firestore");

const GenrePicker = () => {
  const [genres, setGenres] = useState([]);
  const [selected, setSelected] = useState([]);
  const [genreCount, setGenreCount] = useState(0);
  const [maxGenreErr, setMaxGenreErr] = useState(false);
  const [loading, setLoading] = useState(undefined);
  const [adding, setAdding] = useState(false);
  const [completed, setCompleted] = useState(false);

  const history = useNavigate();
  let delay = 0;
  const TOKEN = window.localStorage.getItem("token");
  const URL = "https://api.spotify.com/v1";
  useEffect(() => {
    setLoading(true);

    async function hasGenre() {
      const uid =
        JSON.parse(window.localStorage.getItem("userDetails")).uid || null;
      const hasGenres = await Firestore.getGenreData(uid);
      console.log(hasGenres);

      if (hasGenres.hasData) history("/home");
      else getGenres();
    }

    async function getGenres() {
      axios
        .get(URL + "/recommendations/available-genre-seeds", {
          headers: {
            Authorization: "Bearer " + TOKEN,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          setLoading(false);
          setGenres(res.data.genres);
        })
        .catch((err) => console.log(err.response));
    }

    hasGenre();
    // if (true) getGenres();
  }, [TOKEN, history]);

  const selectedGenres = (e) => {
    if (selected.includes(e.target.innerText)) {
      let index = selected.indexOf(e.target.innerText);
      setSelected(
        selected.filter((_, i) => {
          return i !== index;
        })
      );

      e.target.classList.remove("selected");
      setGenreCount((prev) => prev - 1);
    } else {
      if (genreCount === 10) {
        setMaxGenreErr(true);
        return;
      }
      setSelected((prev) => [...prev, e.target.innerText]);
      e.target.classList.add("selected");
      setGenreCount((prev) => prev + 1);
    }
  };

  const closeError = (e) => {
    e.preventDefault();
    const errDiv = document.getElementById("err");
    errDiv.classList.add("fadeOut");
    setTimeout(() => {
      errDiv.style.display = "none";
    }, 1000);
    setMaxGenreErr(false);
  };

  const submitGenre = async () => {
    setAdding(true);
    await Firestore.updateGenre(selected);
    const uid = JSON.parse(window.localStorage.getItem("userDetails")).uid;
    const hasGenres = await Firestore.getGenreData(uid);
    setAdding(false);
    if (hasGenres.hasData) history("/home");
    else toast.error("Error updating genres.");
  };

  return (
    <section id="genrePicker">
      <div className="container">
        <div className="title">
          <h1>Select Genres</h1>
        </div>

        {loading ? (
          <h1>Loading Genres...</h1>
        ) : (
          <div className="bubble">
            {genres.map((genre) => {
              delay = delay + 10;
              return (
                <Picker
                  key={genre}
                  data={genre}
                  width={"maxContent"}
                  height={"maxContent"}
                  selected={selectedGenres}
                  delay={`${delay}ms`}
                />
              );
            })}
          </div>
        )}
      </div>
      {selected.length > 0 ? (
        <div className="continue" onClick={() => submitGenre()}>
          {adding ? <Spinner /> : <span>Continue</span>}
        </div>
      ) : (
        ""
      )}
      {maxGenreErr ? (
        <div className="err" onClick={closeError} id="err">
          <span>You can select atmost 10 genres.</span>
        </div>
      ) : (
        ""
      )}
    </section>
  );
};

export default GenrePicker;
