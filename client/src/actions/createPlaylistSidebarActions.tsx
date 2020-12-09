import {
  SETCREATEPLAYLISTSIDEBAR,
  toggleCreatePlaylistSidebarType,
} from "./types";

export function toggleCreatePlaylistSidebar(
  action: boolean,
  type: toggleCreatePlaylistSidebarType["type"] = SETCREATEPLAYLISTSIDEBAR
): toggleCreatePlaylistSidebarType {
  return {
    type,
    payload: action,
  };
}
