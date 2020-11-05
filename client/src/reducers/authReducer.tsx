import { Reducer } from "redux";
import {
  AuthActionTypes,
  FAILED_AUTH_FORM,
  SIGN_IN,
  SIGN_IN_AS_GUEST,
  SIGN_OUT,
  SIGN_UP,
  SPOTIFY_SIGN_IN,
} from "../actions/types";
import { spotifyAuthState, appAuthState, authFormErrorState } from "../types";

const INITIAL_STATE = {
  isSignedIn: null,
  userData: null,
  spotifyToken: null,
};

export const spotifyAuthReducer: Reducer<spotifyAuthState> = (
  state = INITIAL_STATE,
  action: AuthActionTypes
) => {
  switch (action.type) {
    case SPOTIFY_SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        userData: action.payload.userData,
        spotifyToken: action.payload.spotifyToken,
      };

    default:
      return state;
  }
};

const APP_INITIAL_STATE = {
  isSignedIn: false,
  userData: null,
};

export const appAuthReducer: Reducer<appAuthState> = (
  state = APP_INITIAL_STATE,
  action: AuthActionTypes
) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        userData: action.payload,
      };
    case SIGN_IN_AS_GUEST:
      return {
        ...state,
        isSignedIn: true,
        userData: action.payload,
      };
    case SIGN_UP:
      return {
        ...state,
        isSignedIn: true,
        userData: action.payload,
      };
    case SIGN_OUT:
      return {
        ...state,
        isSignedIn: false,
        userData: null,
      };
    default:
      return state;
  }
};

const FORM_INITIAL_STATE = {
  error: null,
  count: 0,
};
export const authFormErrorReducer: Reducer<authFormErrorState> = (
  state = FORM_INITIAL_STATE,
  action: AuthActionTypes
) => {
  switch (action.type) {
    case FAILED_AUTH_FORM:
      return {
        ...state,
        error: action.payload,
        count: ++state.count,
      };
    default:
      return state;
  }
};
