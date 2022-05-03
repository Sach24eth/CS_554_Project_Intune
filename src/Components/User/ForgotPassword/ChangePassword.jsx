import React, { useState } from "react";
import Spinner from "../../Spinner";

import "./password.css";

const ChangePassword = () => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(undefined);
  const onFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
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
        </div>
        <p>{err}</p>
      </div>
    </section>
  );
};

export default ChangePassword;
