## Note
The website is hosted on the follwing links:
- [Frontend](https://spotify-ten-wine.vercel.app/)
- [Backend](https://sync-music-s.herokuapp.com/)

Please allow couple minutes for heroku server to restart

## If running on localhost please follow the steps below, all required .env files are pushed to github

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

## Issues with the Spotify API

There may be some issues with Spotify API, we are listing few that we know

1. Seek bar won’t update until paused as we required the data coming from the player instance using “/me/player” end-point. This was working but recently has been reported broken by community. ([Link to the article](https://community.spotify.com/t5/Spotify-for-Developers/currently-playing-returning-incorrect-progress-ms/td-p/5380840))
