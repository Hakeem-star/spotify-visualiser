import { playSongPayload, songSearchResult, userData } from "../types";

export const SONG_SEARCH = "SONG_SEARCH";
export const PLAY_SONG = "PLAY_SONG";
export const SIGN_IN = "SIGN_IN";
export const SIGN_IN_AS_GUEST = "SIGN_IN_AS_GUEST";
export const SPOTIFY_SIGN_IN = "SPOTIFY_SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";
export const SIGN_UP = "SIGN_UP";
export const SPOTIFY = "SPOTIFY";
export const YOUTUBE = "YOUTUBE";
export const TOGGLE_PLAY_STATE = "TOGGLE_PLAY_STATE";
export const FAILED_AUTH_FORM = "FAILED_AUTH_FORM";

export interface spotifySignInAction {
  type: typeof SPOTIFY_SIGN_IN;
  payload: { userData: userData; spotifyToken: string };
}

export interface signInAsGuestType {
  type: typeof SIGN_IN_AS_GUEST;
  payload: { displayName: "Guest"; email: "Guest" };
}

export interface signInAction {
  type: typeof SIGN_IN;
  payload: { email: string; displayName: string };
}

export interface signOutAction {
  type: typeof SIGN_OUT;
}

export interface signUpAction {
  type: typeof SIGN_UP;
  payload: { displayName: string; email: string };
}
export interface failedAuthForm {
  type: typeof FAILED_AUTH_FORM;
  payload: null | string;
}

export type AuthActionTypes =
  | signOutAction
  | spotifySignInAction
  | signInAction
  | signUpAction
  | signInAsGuestType
  | failedAuthForm;

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
