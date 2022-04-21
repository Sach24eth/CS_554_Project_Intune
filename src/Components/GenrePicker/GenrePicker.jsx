import React, { useState, useEffect } from "react";
import "./gpicker.css";
import axios from "axios";
import Picker from "./Picker";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const GenrePicker = () => {
  const [genres, setGenres] = useState([]);
  const [selected, setSelected] = useState([]);
  const [genreCount, setGenreCount] = useState(0);
  const [maxGenreErr, setMaxGenreErr] = useState(false);
  const [loading, setLoading] = useState(undefined);
  let delay = 0;
  const TOKEN = window.localStorage.getItem("token");
  const URL = "https://api.spotify.com/v1";
  useEffect(() => {
    setLoading(true);
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

    getGenres();
  }, [TOKEN]);

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
        <div className="continue">
          <span>Continue</span>
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
