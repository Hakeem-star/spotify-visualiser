import { Reducer } from "redux";
import { AuthActionTypes, SIGN_IN, SIGN_OUT } from "../actions/types";
import { authState } from "../types";
const INITIAL_STATE = {
  isSignedIn: null,
  userData: null,
  spotifyToken: null,
};

export const authReducer: Reducer<authState> = (
  state = INITIAL_STATE,
  action: AuthActionTypes
) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        userData: action.payload.userData,
        spotifyToken: action.payload.spotifyToken,
      };
    case SIGN_OUT:
      return {
        ...state,
        isSignedIn: false,
        userData: null,
        spotifyToken: null,
      };
    default:
      return state;
  }
};
