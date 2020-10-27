import { Reducer } from "redux";
import { SongSearchTypes, SONG_SEARCH } from "../actions/types";

import { songSearchResult } from "../types";

const INITIAL_STATE = {
  spotify: {},
  youtube: {},
};

export const songSearchReducer: Reducer<songSearchResult, SongSearchTypes> = (
  state = INITIAL_STATE,
  action: SongSearchTypes
) => {
  console.log({ action: action.payload });
  switch (action.type) {
    case SONG_SEARCH:
      return action.payload;
    default:
      return state;
  }
};
