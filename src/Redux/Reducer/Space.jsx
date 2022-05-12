const spaceReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_SPACE_INVITE_CODE":
      state.inviteCode = payload;
      return state;
    default:
      return state;
  }
};

export default spaceReducer;
