import React from "react";
import { useParams } from "react-router-dom";
import Auth from "../Components/Auth";

const AuthPage = () => {
  const authType = useParams().authType;
  console.log(authType);
  if (authType === "login") {
    return <Auth type={"Login"} />;
  } else return <Auth type={"Sign Up"} />;
};

export default AuthPage;
