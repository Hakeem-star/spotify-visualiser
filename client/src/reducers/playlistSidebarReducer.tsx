import {
  createPlaylistSidebarOpen,
  SETCREATEPLAYLISTSIDEBAR,
  TOGGLECREATEPLAYLISTSIDEBAR,
} from "../actions/types";

const INITIAL_STATE = false;

export function createPlaylistSidebarReducer(
  state = INITIAL_STATE,
  { type, payload }: createPlaylistSidebarOpen
): boolean {
  switch (type) {
    case SETCREATEPLAYLISTSIDEBAR:
      return payload;
    case TOGGLECREATEPLAYLISTSIDEBAR:
      return !state;
    default:
      return state;
  }
}
