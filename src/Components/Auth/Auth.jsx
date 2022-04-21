import React, { useState } from "react";
import TextField from "./TextField";
import "./auth.css";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Firebase = require("../../Firebase/Firebase")
const Auth = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [displayName, setName] = useState("");
  const type = props.type;

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

  const submitBtn = (type) => {
    if(type === "Login"){
      if(email ==='' || password === ''){
        toast.error('Please enter all the fields')
      }else{
        const ha=Firebase.AppUserLogin({email, password})
        console.log("ha",ha)
      }
    }
    else{
      if(email ==='' || password === '' || repeat === ''){
        toast.error('Please enter all the fields')
      }
      else{
        if(password !== repeat){
          toast.error("Passwords do not match");
        }
        else{
          Firebase.AppUserCreation({email, password, displayName})
        }
      }
    }
  }

  const googleLogin = () => {
    Firebase.GoogleLogin()
  }

  return (
    <section id="auth">
      <div className="container">
       {type === "Login" ? (
        <h1>To continue, log in</h1>
        ) : (
        <h1>Sign Up to get started</h1>
        )}
        <div className="google-btn" onClick={()=>googleLogin()}>
          {type} with Google</div>
        <div>
         or
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

          <div className="btn" onClick={()=>submitBtn(type)}>{type}</div>
         
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
