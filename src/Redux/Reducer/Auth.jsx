const authReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case "AUTH_LOGIN":
      state.id = payload.uid;
      state.displayName = payload.displayName;
      state.email = payload.email;
      state.isLoggedIn = true;
      state.timestamp = new Date().getTime();
      state.lastLoginAt = payload.lastLoginAt;
      return state;
    case "AUTH_LOGOUT":
      let newState = {};
      return newState;
    default:
      return state;
  }
};

export default authReducer;
