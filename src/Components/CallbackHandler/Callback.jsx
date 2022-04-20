import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Firebase from "../../Firebase/Firebase";
const Callback = () => {
  const history = useNavigate();
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    async function getAccessToken() {
      axios
        .post(`${process.env.REACT_APP_API_URL}/login`, {
          code: code,
        })
        .then((res) => {
          let date = new Date();
          let accessTokenCreatedTime = date.getTime();
          window.localStorage.setItem("access_token", res.data.accessToken);
          window.localStorage.setItem("expires_in", res.data.expiresIn);
          window.localStorage.setItem("refresh_token", res.data.refreshToken);
          window.localStorage.setItem("id", res.data.id);
          window.localStorage.setItem(
            "accessTokenCreatedTime",
            accessTokenCreatedTime
          );
          console.log("res", res);
          Firebase(res.data);
          history(`/me`);
        })
        .catch((err) => console.log(err.response));
    }

    if (code) {
      console.log(`Code is: ${code}`);
      getAccessToken();
    }
  }, [history]);

  return (
    <section>
      <div style={{ margin: "1rem" }}>
        <h1>Redirecting...</h1>
      </div>
    </section>
  );
};

export default Callback;
