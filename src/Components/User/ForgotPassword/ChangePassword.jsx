import React, { useState, useEffect } from "react";
import Spinner from "../../Spinner";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./password.css";
const Firebase = require("../../../Firebase/Firebase");
const ChangePassword = () => {
  const history = useNavigate();
  useEffect(() => {
    const authLocalStorage = parseInt(
      window.localStorage.getItem("authentication")
    );

    if (authLocalStorage === 0) {
      history("/auth/login");
    }

    return;
  }, []);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(undefined);
  const [displayReset, setDisplayReset] = useState(false);
  const onFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };
  const resetPassword = async () => {
    Firebase.ResetPassword();
    setDisplayReset(false);
  };
  const onSubmitForm = async (e) => {
    setIsLoading(true);
    console.log("hello");
    console.log(formData.newPassword === formData.repeatPassword);
    if (Object.keys(formData).length !== 3) {
      setIsLoading(false);
      return setErr("Please check all required fields");
    } else if (formData.newPassword !== formData.repeatPassword) {
      setIsLoading(false);
      return setErr("Passwords do not match");
    } else {
      setIsLoading(false);
      const checkIfUpdated = Firebase.ChangePassword(formData);
      console.log("updated?", checkIfUpdated);
      if (!checkIfUpdated) {
        setDisplayReset(true);
      }
    }
  };

  return (
    <section id="forgot_password">
      <div className="container">
        <h1>Forgot Password</h1>
        <div className="form" id="form">
          <label>
            <input
              type={"password"}
              name="oldPassword"
              placeholder="Enter Old Password"
              onChange={onFormChange}
            />
          </label>
          <label>
            <input
              type={"password"}
              name="newPassword"
              placeholder="Enter New Password"
              onChange={onFormChange}
            />
          </label>
          <label>
            <input
              type={"password"}
              name="repeatPassword"
              placeholder="Repeat New Password"
              onChange={onFormChange}
            />
          </label>
          <div className="submit" onClick={onSubmitForm}>
            {isLoading ? <Spinner /> : "Submit"}
          </div>
          <ToastContainer />
        </div>
        <p>{err}</p>
        <br></br>
        {displayReset && (
          <p className="reset-password" onClick={resetPassword}>
            Click to reset your password
          </p>
        )}
      </div>
    </section>
  );
};

export default ChangePassword;
