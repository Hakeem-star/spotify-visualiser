import { Reducer } from "redux";
import {
  TOGGLE_PLAY_STATE,
  playerStates,
  SPOTIFY,
  YOUTUBE,
  PLAY_SONG,
  playlistItemSongsType,
  NEXT_SONG,
  PREV_SONG,
  playSongReducerType,
} from "../actions/types";
import { playSongPayload } from "../types";

export interface playSongReducedState {
  play: boolean;
  url: string;
  source: string;
  context: playlistItemSongsType[];
  index: number;
}

const INITIAL_STATE = {
  play: false,
  url: "",
  source: "",
  context: [] as playlistItemSongsType[],
  index: 0,
  playlistId: "",
};

export const playSongReducer = (
  state = INITIAL_STATE,
  action: {
    type: playerStates;
    payload: {
      context: playlistItemSongsType[];
      index: number;
      playlistId: string;
    };
  }
): playSongReducerType => {
  // console.log("TOGGLE", action.type);
  console.log({ state: state });
  if (action.type === PLAY_SONG) {
    if (
      state?.context[state.index]?.url ===
      action.payload.context[action.payload.index].url
    ) {
      //if the song url has not changed
      //Just change the play state to pause the video
      return {
        ...state,
        play: !state.play,
        playlistId: action.payload.playlistId,
      };
    } else {
      return {
        ...state,
        url: action.payload.context[action.payload.index].url,
        source: action.payload.context[action.payload.index].source,
        context: action.payload.context,
        index: action.payload.index,
        play: true,
        playlistId: action.payload.playlistId,
      };
    }
  }
  //When playing a playlist, the song index is stored in state and used to access the song in the playlist array.
  if (action.type === NEXT_SONG) {
    if (state.index + 1 < state.context.length) {
      return {
        ...state,
        play: true,
        url: state.context[state.index + 1].url,
        source: state.context[state.index + 1].source,
        index: state.index + 1,
      };
    }
  }

  if (action.type === PREV_SONG) {
    if (state.index) {
      return {
        ...state,
        play: true,
        url: state.context[state.index - 1].url,
        source: state.context[state.index - 1].source,
        index: state.index - 1,
      };
    }
  }

  if (action.type === TOGGLE_PLAY_STATE) {
    //pause or play the tune if the same one is clicked again or the play button from the player was clicked
    return { ...state, play: !state.play };
  }

  return state;
};
