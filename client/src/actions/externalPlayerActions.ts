import {
  AppActions,
  SEEKPOSITION,
  SETCURRENTSONGDETAILS,
  metaSongDetailsPayload,
} from "./types";

export const setCurrentSongDetails = (
  payload: metaSongDetailsPayload
): AppActions => {
  return {
    type: SETCURRENTSONGDETAILS,
    payload,
  };
};

export const seekSongPosition = (seekPosition: number): AppActions => {
  console.log({ seekPosition });
  return {
    type: SEEKPOSITION,
    payload: { seekPosition },
  };
};
