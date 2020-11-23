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
};

export const playSongReducer = (
  state = INITIAL_STATE,
  action: {
    type: playerStates;
    payload: { context: playlistItemSongsType[]; index: number };
  }
) => {
  // console.log("TOGGLE", action.type);

  if (action.type === PLAY_SONG) {
    console.log(
      action.type,
      state?.context[state.index]?.url,
      action.payload.context[action.payload.index].url
    );
    if (
      state?.context[state.index]?.url ===
      action.payload.context[action.payload.index].url
    ) {
      //if the song id has not changed
      //Just change the play state to pause the video
      return {
        ...state,
        play: !state.play,
      };
    } else {
      console.log("BP", {
        ...state,
        url: action.payload.context[action.payload.index].url,
        source: action.payload.context[action.payload.index].source,
        context: action.payload.context,
        index: action.payload.index,
        play: true,
      });
      return {
        ...state,
        url: action.payload.context[action.payload.index].url,
        source: action.payload.context[action.payload.index].source,
        context: action.payload.context,
        index: action.payload.index,
        play: true,
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

  // return {
  //   play: true,
  //   url: action.payload.context[action.payload.index].url,
  //   source: action.payload.context[action.payload.index].source,
  //   context: action.payload.context,
  //   index: action.payload.index,
  // };
};

// export const playerStateReducer = (
//   state = INITIAL_STATE,
//   action: { type: songPlatforms; payload: playSongPayload } = {
//     type: null,
//     payload: null,
//   }
// ): playSongReducedState => {
//   if (action.payload) {
//     //if the song id has not changed
//     if (state.url === action.payload.id) {
//       //Just change the play state to pause the video
//       return { ...state, play: !state.play };
//     }

//     if (action.type === TOGGLE_PLAY_STATE) {
//       //pause or play the tune if the same one is clicked again or the play button from the player was clicked
//       return { ...state, play: !state.play };
//     }

//     return state;
//   }
// };
