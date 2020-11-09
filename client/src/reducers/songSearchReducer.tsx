import { Reducer } from "redux";
import { SongSearchTypes, SONG_SEARCH } from "../actions/types";

import { songSearchResult } from "../types";

const INITIAL_STATE = {
  spotify: {},
  youtube: {},
} as songSearchResult;

export const songSearchReducer = (
  state = INITIAL_STATE,
  action: SongSearchTypes
): songSearchResult => {
  switch (action.type) {
    case SONG_SEARCH:
      return { ...action.payload };
    default:
      return state;
  }
};
