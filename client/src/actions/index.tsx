import axios from "axios";
import { getCookie, deleteAllCookies } from "../util/cookie";
import { SONG_SEARCH, PLAY_SONG, SIGN_IN, SIGN_OUT } from "./types";

export const signIn = (): Promise<void> => {
  const accessToken = getCookie("ACCESS_TOKEN");

  return async (dispatch, getState) => {
    if (accessToken) {
      //attempt to fetch user Data (also verifies validity of token)
      const userData = await axios.get("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + accessToken },
      });
      dispatch({
        type: SIGN_IN,
        payload: userData,
      });
    }
  };
};

export const signOut = (): {
  type: string;
} => {
  deleteAllCookies();
  return {
    type: SIGN_OUT,
  };
};
