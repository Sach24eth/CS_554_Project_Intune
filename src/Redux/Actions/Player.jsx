export const updateSpotifyPlayerState = (state) => {
  return {
    type: "UPDATE_SPOTIFY_PLAYER_STATE",
    payload: { connected: state },
  };
};
