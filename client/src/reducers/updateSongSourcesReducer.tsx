import { AppActions, UPDATE_SONG_SOURCE } from "../actions/types";
import { updateSongSourcesType } from "../types";
//This needs to keep track of the sources ticked on the checkboxes

const DEFAULT_STATE = ["YOUTUBE"];

export const updateSongSourcesReducer = (
  state = DEFAULT_STATE,
  action: AppActions
): updateSongSourcesType => {
  switch (action.type) {
    case UPDATE_SONG_SOURCE:
      return action.payload;
    default:
      return state;
  }
};
