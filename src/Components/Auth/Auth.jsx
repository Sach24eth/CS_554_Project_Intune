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
    setLoading(true);
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
            setLoading(false);
            window.localStorage.setItem("authentication", 1);
            setTimeout(() => {
              history(status.redirectURL);
            }, 700);
          })
          .catch((err) => {
            toast.error(err);
          });
      }
    } else {
      if (email === "" || password === "" || repeat === "") {
        toast.error("Please enter all the fields");
      } else {
        if (password !== repeat) {
          toast.error("Passwords do not match");
        } else {
          const create = await Firebase.AppUserCreation({
            email,
            password,
            displayName,
          });

          if (create.status !== 200) {
            toast.error(create.message.message);
          } else {
            const userDetails = JSON.parse(
              window.localStorage.getItem("userDetails")
            );
            window.localStorage.setItem("authentication", 1);
            dispatch(
              authLogin(
                userDetails.uid,
                userDetails.displayName,
                userDetails.email,
                userDetails.lastLoginAt
              )
            );

            props.onLogin();
            history("/genres");
          }
        }
      }
      setLoading(false);
    }
  };
  const googleLogin = async () => {
    const login = await Firebase.GoogleLogin();
    if (login.status === 400) return toast.error(login.message);
    else {
      toast.success(login.message);
      window.localStorage.setItem("authentication", 1);
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
      history("/genres");
    }
  };

  const type = props.type;

  useEffect(() => {
    if (type === "Logout") {
      Firebase.AppSignOut();
      props.onLogout();
      window.localStorage.removeItem("userDetails");
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("refresh_token");
      window.localStorage.removeItem("accessTokenCreatedTime");
      window.localStorage.removeItem("expires_in");
      window.localStorage.setItem("authentication", 0);
    }
  }, [type]);
  if (type === "Logout") {
    return (
      <div className="center">
        <h1>Logging out...</h1>
      </div>
    );
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
