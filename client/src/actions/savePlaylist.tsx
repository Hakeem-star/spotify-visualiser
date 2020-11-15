import { Dispatch } from "redux";
import { v4 as uuidv4 } from "uuid";
import { AppState } from "../reducers";
import { ThunkResult } from "../types";
import { fbStore } from "../util/firebase_init";
import { AppActions, GUEST, PLAYLISTS, SAVEPLAYLIST } from "./types";

export function savePlaylist(
  name?: string,
  playlistID: string = uuidv4()
): ThunkResult<void> {
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    console.log({ name });
    if (name) {
      const createdPlaylist = getState().createPlaylist;
      const email = getState().auth?.userData?.email;

      if (email !== GUEST) {
        try {
          //save this playlist to firebase and then add a listener to dispatch when a success is recieved
          await fbStore
            .collection("users")
            .doc(email)
            .update({
              [`[${PLAYLISTS}].${playlistID}`]: {
                name,
                items: createdPlaylist,
              },
            });
          // .doc(playlistID)
          // .set({ name, items: createdPlaylist });
        } catch (error) {
          console.log(error);
        }
      } else {
        //Store in local storage
        const storedPlaylists = window.localStorage.getItem(PLAYLISTS);

        if (!storedPlaylists) {
          window.localStorage.setItem(
            PLAYLISTS,
            JSON.stringify({ [playlistID]: { name, items: createdPlaylist } })
          );
        } else {
          const storagePlaylist = JSON.parse(storedPlaylists);
          const newPlay = {
            ...storagePlaylist,
            [playlistID]: { name, items: createdPlaylist },
          };

          window.localStorage.setItem(PLAYLISTS, JSON.stringify(newPlay));
        }
      }
      dispatch({
        type: SAVEPLAYLIST,
        payload: { [playlistID]: { name, items: createdPlaylist } },
      });
    } else {
      const auth = getState().auth;
      console.log(JSON.stringify(auth));
      if (auth.userData?.displayName === GUEST) {
        const localPLaylists = window.localStorage.getItem(PLAYLISTS);
        if (localPLaylists) {
          const parsedPlaylists = JSON.parse(localPLaylists);
          console.log({ parsedPlaylists });
          dispatch({
            type: SAVEPLAYLIST,
            payload: parsedPlaylists,
          });
        }
      } else {
        //get playlists from firebase
        try {
          //save this playlist to firebase and then add a listener to dispatch when a success is recieved
          const result = await fbStore
            .collection("users")
            .doc(auth.userData?.email)
            .get();
          console.log({ result: result.data()?.playlists });
          dispatch({
            type: SAVEPLAYLIST,
            payload: result.data()?.playlists,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
}
