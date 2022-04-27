import authReducer from "./Auth";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  auth: authReducer,
});

export default rootReducer;
