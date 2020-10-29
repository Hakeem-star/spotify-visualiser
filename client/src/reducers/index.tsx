import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { playSongReducer } from "./playSongReducer";
import { songSearchReducer } from "./songSearchReducer";

export const rootReducer = combineReducers({
  auth: authReducer,
  songSearchResults: songSearchReducer,
  playerState: playSongReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
