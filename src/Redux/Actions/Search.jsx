export const storePrevSearchRes = (results) => {
  return {
    type: "STORE_LAST_SEARCH_RESULTS",
    payload: results,
  };
};
