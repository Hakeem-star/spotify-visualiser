import {
  SETCURRENTSONGDETAILS,
  setCurrentSongDetailsType,
} from "../actions/types";

const INITIAL_STATE = { duration: 0, position: 0 };

export function setCurrentSongDetailsReducer(
  state = INITIAL_STATE,
  action: setCurrentSongDetailsType
): setCurrentSongDetailsType["payload"] {
  const { type, payload } = action;

  switch (type) {
    case SETCURRENTSONGDETAILS:
      return { ...state, ...payload };

    default:
      return state;
  }
}
