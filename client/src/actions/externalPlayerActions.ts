import {
  AppActions,
  SETCURRENTSONGDETAILS,
  setCurrentSongDetailsType,
} from "./types";

export const setCurrentSongDetails = (
  payload: setCurrentSongDetailsType["payload"]
): AppActions => {
  return {
    type: SETCURRENTSONGDETAILS,
    payload,
  };
};
