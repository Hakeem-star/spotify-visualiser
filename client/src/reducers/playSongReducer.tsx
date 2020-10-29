import { Reducer } from "redux";
import { PLAY_PAUSE, songPlatforms, SPOTIFY, YOUTUBE } from "../actions/types";
import { playSongPayload } from "../types";

interface reducedState {
  playing: boolean;
  url: string;
  source: string;
}

const INITIAL_STATE = {
  playing: false,
  url: "",
  source: "",
};

export const playSongReducer = (
  state = INITIAL_STATE,
  action: { type: songPlatforms; payload: playSongPayload } = {
    type: null,
    payload: null,
  }
): reducedState => {
  if (action.payload) {
    //if the song id has not changed
    if (state.url === action.payload.id) {
      //Just change the play state to pause the video
      return { ...state, playing: !state.playing };
    }

    switch (action.type) {
      case YOUTUBE:
        return { playing: true, url: action.payload.id, source: action.type };
      case SPOTIFY:
        return { playing: true, url: action.payload.id, source: action.type };
      default:
        return state;
    }
  }
  if (action.type === PLAY_PAUSE) {
    //pause or play the tune if the same one is clicked again or the play button from the player was clicked
    return { ...state, playing: !state.playing };
  }
  return state;
};
