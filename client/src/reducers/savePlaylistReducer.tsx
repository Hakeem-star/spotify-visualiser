import { savePlaylist, SAVEPLAYLIST } from "../actions/types";

const INITIAL_STATE = {};

export function savePlaylistReducer(
  state = INITIAL_STATE,
  { type, payload }: savePlaylist
): savePlaylist["payload"] {
  switch (type) {
    case SAVEPLAYLIST:
      return { ...state, ...payload };

    default:
      return state;
  }
}
