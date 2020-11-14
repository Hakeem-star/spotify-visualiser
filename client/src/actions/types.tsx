import { DraggableLocation } from "react-beautiful-dnd";
import {
  playSongPayload,
  remappedSearchResult,
  songSearchResult,
  updateSongSourcesType,
  userData,
} from "../types";

export const SONG_SEARCH = "SONG_SEARCH";
export const PLAY_SONG = "PLAY_SONG";
export const NEXT_SONG = "NEXT_SONG";
export const PREV_SONG = "PREV_SONG";
export const PLAYLIST = "PLAYLIST";
export const SIGN_IN = "SIGN_IN";
export const SIGN_IN_AS_GUEST = "SIGN_IN_AS_GUEST";
export const SPOTIFY_SIGN_IN = "SPOTIFY_SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";
export const SIGN_UP = "SIGN_UP";
export const SPOTIFY = "SPOTIFY";
export const YOUTUBE = "YOUTUBE";
export const TOGGLE_PLAY_STATE = "TOGGLE_PLAY_STATE";
export const FAILED_AUTH_FORM = "FAILED_AUTH_FORM";
export const UPDATE_SONG_SOURCE = "UPDATE_SONG_SOURCE";
export const REORDER = "REORDER";
export const ADDTODRAGNDROP = "ADDTODRAGNDROP";
export const SETCREATEPLAYLISTSIDEBAR = "SETCREATEPLAYLISTSIDEBAR";
export const TOGGLECREATEPLAYLISTSIDEBAR = "TOGGLECREATEPLAYLISTSIDEBAR";
export const SAVEPLAYLIST = "SAVEPLAYLIST";
export const DISCARDPLAYLIST = "DISCARDPLAYLIST";

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
export interface songSources {
  type: typeof UPDATE_SONG_SOURCE;
  payload: updateSongSourcesType;
}

export type SongSearchTypes = songSearch | songSources;

export interface playSong {
  type: typeof SPOTIFY | typeof YOUTUBE;
  payload: playSongPayload;
}

export type playerStates =
  | typeof TOGGLE_PLAY_STATE
  | typeof PLAY_SONG
  | typeof PLAYLIST
  | typeof NEXT_SONG
  | typeof PREV_SONG
  | null;

export interface reorderDragNDrop {
  type: typeof REORDER;
  payload: { startIndex: number; endIndex: number };
}

type remappedSearchResultItem = remappedSearchResult["items"][0];

export interface playlistItemType extends remappedSearchResultItem {
  source: string;
}

export interface addToDragNDrop {
  type: typeof ADDTODRAGNDROP;
  payload: {
    droppableDestination: DraggableLocation;
    item: playlistItemType;
  };
}

export interface discardPlaylist {
  type: typeof DISCARDPLAYLIST;
}

export type playlistDragDrop =
  | reorderDragNDrop
  | addToDragNDrop
  | discardPlaylist;

export interface setCreatePlaylistSidebar {
  type: typeof SETCREATEPLAYLISTSIDEBAR;
  payload: boolean;
}

export interface toggleCreatePlaylistSidebarOpen {
  type: typeof TOGGLECREATEPLAYLISTSIDEBAR;
  payload?: any;
}

export interface savePlaylist {
  type: typeof SAVEPLAYLIST;
  payload: {
    [k: string]: {
      name: string;
      items: playlistItemType[];
    };
  };
}

export type createPlaylistSidebarOpen =
  | setCreatePlaylistSidebar
  | toggleCreatePlaylistSidebarOpen;

export type AppActions =
  | AuthActionTypes
  | SongSearchTypes
  | playSong
  | playlistDragDrop
  | savePlaylist;
