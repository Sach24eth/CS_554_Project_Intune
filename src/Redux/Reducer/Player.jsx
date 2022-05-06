const playerReducer = (state = { connection: false }, action) => {
  const { type, payload } = action;
  switch (type) {
    case "UPDATE_SPOTIFY_PLAYER_STATE":
      state.connection = payload.connected;
      return state;
    default:
      return state;
  }
};

export default playerReducer;
