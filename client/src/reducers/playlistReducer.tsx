import {
  deletePlaylist,
  DELETEPLAYLIST,
  savePlaylist,
  SAVEPLAYLIST,
} from "../actions/types";

const INITIAL_STATE = {};

export function savePlaylistReducer(
  state = INITIAL_STATE,
  { type, payload }: savePlaylist | deletePlaylist
): savePlaylist["payload"] {
  switch (type) {
    case SAVEPLAYLIST:
      return { ...state, ...payload };

    case DELETEPLAYLIST:
      return { ...payload };

    default:
      return state;
  }
}
