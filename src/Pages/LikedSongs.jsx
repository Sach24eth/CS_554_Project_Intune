import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LikedSongs from "../Components/LikedSongs";

const LikedSongsPage = () => {
  const history = useNavigate();
  useEffect(() => {
    const authLocalStorage = parseInt(
      window.localStorage.getItem("authentication")
    );

    if (authLocalStorage === 0) {
      history("/auth/login");
    }
  }, []);
  return <LikedSongs history={history} />;
};

export default LikedSongsPage;
