import { songSearchResult, userData } from "../types";

export const SONG_SEARCH = "SONG_SEARCH";
export const PLAY_SONG = "PLAY_SONG";
export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";

export interface signInAction {
  type: typeof SIGN_IN;
  payload: { userData: userData; spotifyToken: string };
}

export interface signOutAction {
  type: typeof SIGN_OUT;
}

export type AuthActionTypes = signOutAction | signInAction;

export interface songSearch {
  type: typeof SONG_SEARCH;
  payload: songSearchResult;
}

export type SongSearchTypes = songSearch;

export type AppActions = AuthActionTypes | SongSearchTypes;
