import { Reducer } from "redux";
import {
  TOGGLE_PLAY_STATE,
  songPlatforms,
  SPOTIFY,
  YOUTUBE,
} from "../actions/types";
import { playSongPayload } from "../types";

export interface playSongReducedState {
  play: boolean;
  url: string;
  source: string;
}

const INITIAL_STATE = {
  play: false,
  url: "",
  source: "",
};

export const playSongReducer = (
  state = INITIAL_STATE,
  action: { type: songPlatforms; payload: playSongPayload } = {
    type: null,
    payload: null,
  }
): playSongReducedState => {
  if (action.payload) {
    //if the song id has not changed
    if (state.url === action.payload.id) {
      //Just change the play state to pause the video
      return { ...state, play: !state.play };
    }

    switch (action.type) {
      case YOUTUBE:
        return { play: true, url: action.payload.id, source: action.type };
      case SPOTIFY:
        return { play: true, url: action.payload.id, source: action.type };
      default:
        return state;
    }
  }
  if (action.type === TOGGLE_PLAY_STATE) {
    //pause or play the tune if the same one is clicked again or the play button from the player was clicked
    return { ...state, play: !state.play };
  }

  return state;
};
