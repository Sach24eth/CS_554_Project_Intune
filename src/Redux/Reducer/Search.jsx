const searchReducer = (state = null, action) => {
  const { type, payload } = action;

  switch (type) {
    case "STORE_LAST_SEARCH_RESULTS":
      state = payload;
      return state;
    default:
      return state;
  }
};

export default searchReducer;
