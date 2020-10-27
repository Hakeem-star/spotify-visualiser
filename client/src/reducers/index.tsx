import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { songSearchReducer } from "./songSearchReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  songSearchResults: songSearchReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
