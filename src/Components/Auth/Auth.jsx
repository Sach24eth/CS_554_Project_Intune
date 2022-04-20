import React, { useState } from "react";
import TextField from "./TextField";
import "./auth.css";
import { NavLink } from "react-router-dom";

const Auth = (props) => {
  const [auth, setAuth] = useState({});
  const type = props.type;
  const onChange = (e) => {
    setAuth((prev) => {
      [e.target.name] = e.target.value;
    });
  };
  return (
    <section id="auth">
      <div className="container">
        <div className="auth-form-title">
          <h1>{props.type}</h1>
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
              name="RepeatPassword"
            />
          )}

          <div className="btn">{type}</div>
        </form>
        <NavLink to={`/auth/${type === "Login" ? "signup" : "login"}`}>
          {type === "Login"
            ? "Don't have an account? Sign Up."
            : "Already have an account? Login."}
        </NavLink>
      </div>
    </section>
  );
};

export default Auth;
