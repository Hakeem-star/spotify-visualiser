import { combineReducers } from "redux";
import {
  spotifyAuthReducer,
  appAuthReducer,
  authFormErrorReducer,
} from "./authReducer";
import { createPlaylistSidebarReducer } from "./createPlaylistSidebarReducer";
import { playlistDragDropReducer } from "./playlistDragDropReducer";
import { playSongReducer } from "./playSongReducer";
import { songSearchReducer } from "./songSearchReducer";
import { updateSongSourcesReducer } from "./updateSongSourcesReducer";

export const rootReducer = combineReducers({
  auth: appAuthReducer,
  formError: authFormErrorReducer,
  spotifyAuth: spotifyAuthReducer,
  songSearchResult: songSearchReducer,
  playerState: playSongReducer,
  songSources: updateSongSourcesReducer,
  createPlaylist: playlistDragDropReducer,
  createPlaylistSidebar: createPlaylistSidebarReducer,
});

export type AppState = ReturnType<typeof rootReducer>;
