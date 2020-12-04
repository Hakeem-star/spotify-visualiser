import {
  SEEKPOSITION,
  SETCURRENTSONGDETAILS,
  metaTypes,
  metaPayloads,
} from "../actions/types";

const INITIAL_STATE = { duration: 0, position: 0, seekPosition: 0 };

export function setCurrentSongDetailsReducer(
  state = INITIAL_STATE,
  action: metaTypes
): metaPayloads {
  const { type, payload } = action;

  switch (type) {
    case SETCURRENTSONGDETAILS:
      return { ...state, ...payload };

    case SEEKPOSITION:
      console.log(SEEKPOSITION, payload);
      //redundant but TS seems to insist
      if (action.type === SEEKPOSITION) {
        return { ...state, ...{ seekPosition: action.payload.seekPosition } };
      }

    default:
      return state;
  }
}
