import React, { useEffect } from "react";
import Space from "../Components/Space";
import { useNavigate } from "react-router-dom";
const SpacePage = ({ hide, hideStatus }) => {
  const history = useNavigate();
  useEffect(() => {
    const authLocalStorage = parseInt(
      window.localStorage.getItem("authentication")
    );

    if (authLocalStorage === 0) {
      history("/auth/login");
      return;
    }
  }, []);
  return <Space hide={hide} hideStatus={hideStatus} />;
};

export default SpacePage;
