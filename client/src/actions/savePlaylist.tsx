import { Dispatch } from "redux";
import { v4 as uuidv4 } from "uuid";
import { AppState } from "../reducers";
import { ThunkResult } from "../types";
import { fbStore } from "../util/firebase_init";
import { AppActions, SAVEPLAYLIST } from "./types";

export function savePlaylist(
  name: string,
  playlistID = uuidv4()
): ThunkResult<void> {
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    const createdPlaylist = getState().createPlaylist;
    const email = getState().auth?.userData?.email;

    if (email !== "Guest") {
      try {
        //save this playlist to firebase and then add a listener to dispatch when a success is recieved
        await fbStore
          .collection("users")
          .doc(email)
          .collection("playlists")
          .doc(playlistID)
          .set({ name, items: createdPlaylist });
      } catch (error) {
        console.log(error);
      }
    } else {
      //Store in local storage
      const storedPlaylists = window.localStorage.getItem("playlists");

      if (!storedPlaylists) {
        window.localStorage.setItem(
          "playlists",
          JSON.stringify({ [playlistID]: { name, items: createdPlaylist } })
        );
      } else {
        const storagePlaylist = JSON.parse(storedPlaylists);
        const newPlay = {
          ...storagePlaylist,
          [playlistID]: { name, items: createdPlaylist },
        };

        window.localStorage.setItem("playlists", JSON.stringify(newPlay));
      }
    }
    dispatch({
      type: SAVEPLAYLIST,
      payload: { [playlistID]: { name, items: createdPlaylist } },
    });
  };
}
