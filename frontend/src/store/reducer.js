const initialState = {
  auth: false,
  user: null,
  key: null,
  clientPublicKey: null,
  encryptedAesKey: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "False_Auth":
      return {
        ...state,
        auth: false,
        user: null,
        key: null,
        clientPublicKey: null,
        encryptedAesKey: null,
      };
    case "True_Auth":
      return {
        ...state,
        auth: true,
        user: action.user,
      };
    case "SET_SERVER_PUBLIC_KEY":
      return {
        ...state,
        key: action.key,
      };
    case "SET_CLIENT_PUBLIC_KEY":
      return {
        ...state,
        clientPublicKey: action.key,
      };
    case "SET_AES_KEY":
      return {
        ...state,
        encryptedAesKey: action.key,
      }
    default:
      return state;
  }
};

export default reducer;
