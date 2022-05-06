import authReducer from "./Auth";
import playerReducer from "./Player";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
  player: playerReducer,
});

export default rootReducer;
