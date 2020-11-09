import { SETCREATEPLAYLISTSIDEBAR, TOGGLECREATEPLAYLISTSIDEBAR } from "./types";

export function setCreatePlaylistSidebar(
  state = true
): {
  type: typeof SETCREATEPLAYLISTSIDEBAR;
  payload: boolean;
} {
  return {
    type: SETCREATEPLAYLISTSIDEBAR,
    payload: state,
  };
}
export function toggleCreatePlaylistSidebar(): {
  type: typeof TOGGLECREATEPLAYLISTSIDEBAR;
} {
  return {
    type: TOGGLECREATEPLAYLISTSIDEBAR,
  };
}
