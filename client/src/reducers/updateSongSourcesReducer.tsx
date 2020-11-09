import { AppActions, UPDATE_SONG_SOURCE } from "../actions/types";
//This needs to keep track of the sources ticked on the checkboxes

const DEFAULT_STATE = { source: ["YOUTUBE"] };

export const updateSongSourcesReducer = (
  state = DEFAULT_STATE,
  action: AppActions
) => {
  switch (action.type) {
    case UPDATE_SONG_SOURCE:
      return { source: action.payload };
    default:
      return state;
  }
};
