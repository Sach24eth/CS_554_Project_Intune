import React, { useEffect, useState } from "react";
import TextField from "./TextField";
import "./auth.css";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";
import Spinner from "../Spinner";
import { useDispatch } from "react-redux";
import { authLogin } from "../../Redux/Actions/Auth";
const Firebase = require("../../Firebase/Firebase");
const Auth = (props) => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [displayName, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const onNameChange = (e) => {
    setName(e.target.value);
  };
  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const onRepeatChange = (e) => {
    setRepeat(e.target.value);
  };

  const submitBtn = async (type) => {
    setLoading((prev) => !prev);
    if (type === "Login") {
      if (email === "" || password === "") {
        toast.error("Please enter all the fields");
      } else {
        Firebase.AppUserLogin({ email, password })
          .then((status) => {
            const userDetails = JSON.parse(
              window.localStorage.getItem("userDetails")
            );

            dispatch(
              authLogin(
                userDetails.uid,
                userDetails.displayName,
                userDetails.email,
                userDetails.lastLoginAt
              )
            );

            props.onLogin();
            window.localStorage.setItem("authentication", 1);
            setTimeout(() => {
              history(status.redirectURL);
            }, 700);
          })
          .catch((err) => {
            toast.error(err);
          });
        // console.log("Login Status: " + loginStatus);
      }
      setLoading(false);
    } else {
      if (email === "" || password === "" || repeat === "") {
        toast.error("Please enter all the fields");
      } else {
        if (password !== repeat) {
          toast.error("Passwords do not match");
        } else {
          Firebase.AppUserCreation({ email, password, displayName });
        }
      }
      setLoading(false);
    }
  };
  const googleLogin = () => {
    setLoading(true);
    Firebase.GoogleLogin();
  };

  const type = props.type;

  useEffect(() => {
    if (type === "Logout") {
      Firebase.AppSignOut();
      props.onLogout();
      window.localStorage.setItem("authentication", 0);
    }
  }, [type]);
  if (type === "Logout") {
    return <h1>Logging out...</h1>;
  }

  return (
    <section id="auth">
      <div className="container">
        <div className="socials">
          <div className="google" onClick={() => googleLogin()}>
            <FcGoogle size={20} />
            <span className="text">{props.type} with Google</span>
          </div>
        </div>
        <div className="dividers">
          <span className="divider"></span>
          <span className="text">or</span>
          <span className="divider"></span>
        </div>
        <div className="auth-form-title">
          <h1>{props.type} with email</h1>
        </div>
        {/* <h1>{props.type}</h1> */}

        <form id="auth-form">
          <TextField
            type="email"
            placeholder="Email"
            onChange={onEmailChange}
            name="email"
          />
          {type === "Sign Up" && (
            <TextField
              type="text"
              placeholder="Display Name"
              name="displayName"
              onChange={onNameChange}
            />
          )}
          <TextField
            type="password"
            placeholder="Password"
            onChange={onPasswordChange}
            name="password"
            id="password"
          />
          {type === "Sign Up" && (
            <TextField
              type="password"
              placeholder="Repeat Password"
              name="RepeatPassword"
              onChange={onRepeatChange}
            />
          )}

          <div className="btn" onClick={() => submitBtn(type)}>
            {loading ? <Spinner /> : type}
          </div>
          <ToastContainer />
        </form>
        <NavLink
          className="link"
          to={`/auth/${type === "Login" ? "signup" : "login"}`}
        >
          {type === "Login"
            ? "Don't have an account? Sign Up."
            : "Already have an account? Login."}
        </NavLink>
      </div>
    </section>
  );
};

export default Auth;
