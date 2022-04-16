import qs from "qs";
import axios from "axios";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

const headers = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  },
  auth: {
    username: CLIENT_ID,
    password: CLIENT_SECRET,
  },
};

const data = {
  grant_type: "client_credentials",
};

//Generates token used to query spotify api without user login
//@returns access_token
const generateToken = async () => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    qs.stringify(data),
    headers
  );

  return response.data.access_token;
};

export default generateToken;
