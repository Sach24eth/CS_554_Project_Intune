import React from "react";
import { NavLink } from "react-router-dom";
import "./landing.css";

const Landing = () => {
  return (
    <section id="landing">
      <div className="container">
        <div className="heading">
          <h1 className="title">Listening is everything.</h1>
        </div>
        <div className="para">
          Listen to millions of music, without interruptions.
        </div>
        <NavLink to={"/auth/signup"} className="signup">
          Sign up today
        </NavLink>
      </div>
    </section>
  );
};

export default Landing;
