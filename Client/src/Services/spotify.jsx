const authEndpoint = "https://accounts.spotify.com/authorize";
const redirectUri = process.env.REACT_APP_REDIRECT_URL;
const clientId = process.env.REACT_APP_CLIENT_ID;

const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-library-modify",
  "user-library-read",
  "user-follow-read",
  "user-follow-modify",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-public",
  "user-top-read",
  "user-read-currently-playing",
  "user-read-recently-played",
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes.join(
  "%20"
)}`;
