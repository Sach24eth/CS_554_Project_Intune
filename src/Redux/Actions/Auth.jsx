export const authLogin = (uid, displayName, email, lastLoginAt) => {
  return {
    type: "AUTH_LOGIN",
    payload: {
      uid,
      displayName,
      email,
      lastLoginAt,
    },
  };
};

export const authLogut = () => {
  return {
    type: "AUTH_LOGOUT",
  };
};
