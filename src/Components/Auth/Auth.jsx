import React, { useState } from "react";
import TextField from "./TextField";
import "./auth.css";
import { NavLink } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Auth = (props) => {
  const [auth, setAuth] = useState({});

  const type = props.type;
  const onChange = (e) => {
    setAuth({ ...auth, [e.target.name]: e.target.value });
  };

  return (
    <section id="auth">
      <div className="container">
        <div className="socials">
          <div className="google">
            <FaGoogle size={20} />
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
        <form id="auth-form">
          <TextField
            type="email"
            placeholder="Email"
            onChange={onChange}
            name="email"
          />
          <TextField
            type="password"
            placeholder="Password"
            onChange={onChange}
            name="password"
          />
          {type === "Sign Up" && (
            <TextField
              type="password"
              placeholder="Repeat Password"
              onChange={onChange}
              name="repeatPassword"
            />
          )}

          <div className="btn">{type}</div>
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
