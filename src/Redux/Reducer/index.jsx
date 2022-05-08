import authReducer from "./Auth";
import playerReducer from "./Player";
import searchReducer from "./Search";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
  player: playerReducer,
  searchResults: searchReducer,
});

export default rootReducer;
