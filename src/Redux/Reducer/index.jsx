import authReducer from "./Auth";
import playerReducer from "./Player";
import searchReducer from "./Search";
import spaceReducer from "./Space";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
  player: playerReducer,
  searchResults: searchReducer,
  space: spaceReducer,
});

export default rootReducer;
