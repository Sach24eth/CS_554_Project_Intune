import React, { useEffect } from "react";
import Landing from "../Components/Landing";
import { useNavigate } from "react-router-dom";
const LandingPage = () => {
  const history = useNavigate();
  useEffect(() => {
    const authLocalStorage = parseInt(
      window.localStorage.getItem("authentication")
    );

    if (authLocalStorage === 1) history("/home");
  }, [history]);
  return <Landing />;
};

export default LandingPage;
