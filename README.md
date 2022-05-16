# ⚠️ Note
### Please refer "live" branch as main
The website is hosted on the follwing links:
- [Frontend](https://spotify-ten-wine.vercel.app/)
- [Backend](https://sync-music-s.herokuapp.com/)

For contributions please refer to main branch, as live branch was created on the day of submission.
Rest assures everyone on the team has contributed their best to complete the project.

Please allow couple minutes for heroku server to start

<hr />

### If running on localhost please follow the steps below, all required .env files are pushed to github

## Installing all dependencies:

- In the root directory type the following :

  ```jsx
  npm install
  ```

- For server installations,
  ```jsx
  cd /server
  npm install
  ```

## Seed required data

```jsx
npm run seed
```

If for some reason the above fails, please follow these steps
```jsx
  make sure you are in the root directory
  
  cd /tasks
  node seed.js
```

The above command will seed all required data for smooth functioning of the website.

Seed file will create the following

- All genre list chat room collection (This is required as the chat is a global room where anyone can join)

## User Login Details

```jsx
email: abc@abc.com
password: 1234567

email: tejasraibagi@protonmail.com
password: 12345678
```

## ENV
### ⚠️ Only required if running locally, all env details are setup if using hosted version
```jsx

CLIENT ENV DETAILS
------------------
REACT_APP_CLIENT_ID = 7b3205b4d51841cf9269d58816c779ef
REACT_APP_CLIENT_SECRET = 63e44c6bafbc4e598807c21e0fef08e6
REACT_APP_REDIRECT_URL = http://localhost:3000/callback/
REACT_APP_API_URL = http://localhost:5001/
REACT_APP_FIREBASE_API_KEY = AIzaSyBmFtDJdRXpTOlR1IPpXXI3EHsAp555bxQ
REACT_APP_FIREBASE_AUTH_DOMAIN = spotifyfbauth.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID = spotifyfbauth
REACT_APP_FIREBASE_STORAGE_BUCKET = spotifyfbauth.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = 889400087788
REACT_APP_FIREBASE_APP_ID = 1:889400087788:web:2986a4847a33e6420241c9
REACT_APP_FIREBASE_MEASUREMENT_ID = G-8RCDYZJYVJ
REACT_APP_FIREBASE_DATABASE_URL = https://spotifyfbauth-default-rtdb.firebaseio.com

SERVER ENV DETAILS
------------------
CLIENT_ID = 7b3205b4d51841cf9269d58816c779ef
CLIENT_SECRET = 63e44c6bafbc4e598807c21e0fef08e6
REDIRECT_URI = http://localhost:3000/callback/
```

## Issues with the Spotify API

There may be some issues with Spotify API, we are listing few that we know

1. Seek bar won’t update until paused as we required the data coming from the player instance using “/me/player” end-point. This was working but recently has been reported broken by community. ([Link to the article](https://community.spotify.com/t5/Spotify-for-Developers/currently-playing-returning-incorrect-progress-ms/td-p/5380840))
