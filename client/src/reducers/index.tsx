import { combineReducers } from "redux";
import {
  spotifyAuthReducer,
  appAuthReducer,
  authFormErrorReducer,
} from "./authReducer";
import { playSongReducer } from "./playSongReducer";
import { songSearchReducer } from "./songSearchReducer";
import { updateSongSourcesReducer } from "./updateSongSourcesReducer";

export const rootReducer = combineReducers({
  auth: appAuthReducer,
  formError: authFormErrorReducer,
  spotifyAuth: spotifyAuthReducer,
  songSearchResults: songSearchReducer,
  playerState: playSongReducer,
  songSources: updateSongSourcesReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
