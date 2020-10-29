import { playSongPayload, songSearchResult, userData } from "../types";

export const SONG_SEARCH = "SONG_SEARCH";
export const PLAY_SONG = "PLAY_SONG";
export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";
export const SPOTIFY = "SPOTIFY";
export const YOUTUBE = "YOUTUBE";
export const TOGGLE_PLAY_STATE = "TOGGLE_PLAY_STATE";

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

export interface playSong {
  type: typeof SPOTIFY | typeof YOUTUBE;
  payload: playSongPayload;
}

export type songPlatforms =
  | typeof SPOTIFY
  | typeof YOUTUBE
  | typeof TOGGLE_PLAY_STATE
  | null;
export type AppActions = AuthActionTypes | SongSearchTypes | playSong;
