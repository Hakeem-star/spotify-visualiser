import { Reducer } from "redux";
import {
  FETCHING_SONG_SEARCH,
  SongSearchTypes,
  SONG_SEARCH,
} from "../actions/types";

import { songSearchResult } from "../types";

const INITIAL_STATE = { fetching: false } as songSearchResult;

export const songSearchReducer = (
  state = INITIAL_STATE,
  action: SongSearchTypes
): songSearchResult => {
  switch (action.type) {
    case SONG_SEARCH:
      return { ...action.payload };
    case FETCHING_SONG_SEARCH:
      return { ...state, fetching: action.payload };
    default:
      return state;
  }
};
