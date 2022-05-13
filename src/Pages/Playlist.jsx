import React, { useEffect } from "react";
import Playlist from "../Components/Playlist";
import { useNavigate } from "react-router-dom";

const PlaylistPage = () => {
  const history = useNavigate();
  useEffect(() => {
    const authLocalStorage = parseInt(
      window.localStorage.getItem("authentication")
    );

    if (authLocalStorage === 0) {
      history("/auth/login");
    }
  }, []);
  return <Playlist />;
};

export default PlaylistPage;
