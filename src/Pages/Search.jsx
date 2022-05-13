import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../Components/Search";

const SearchPage = () => {
  const history = useNavigate();
  useEffect(() => {
    const authLocalStorage = parseInt(
      window.localStorage.getItem("authentication")
    );

    if (authLocalStorage === 0) {
      history("/auth/login");
    }
  }, []);

  return <Search />;
};

export default SearchPage;
