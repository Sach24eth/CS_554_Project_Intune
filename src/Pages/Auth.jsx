import React from "react";
import { useParams } from "react-router-dom";
import Auth from "../Components/Auth";

const AuthPage = (props) => {
  const authType = useParams().authType;
  if (authType === "login") {
    return <Auth type={"Login"} onLogin={props.onLogin} />;
  } else if (authType === "signup")
    return <Auth type={"Sign Up"} onLogin={props.onLogin} />;
  else if (authType === "logout")
    return <Auth type={"Logout"} onLogout={props.onLogout} />;
};

export default AuthPage;
