import firebase from "firebase";
import { Dispatch } from "redux";
import { v4 as uuidv4 } from "uuid";
import { AppState } from "../reducers";
import { ThunkResult } from "../types";
import { fbStore } from "../util/firebase_init";
import {
  AppActions,
  DELETEPLAYLIST,
  EDITPLAYLIST,
  GUEST,
  PLAYLISTS,
  SAVEPLAYLIST,
} from "./types";

export function savePlaylist(
  name?: string,
  playlistID: string = uuidv4()
): ThunkResult<void> {
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    //If there is a name, we are setting the playlists based on an action in the app
    if (name) {
      const createdPlaylist = getState().createPlaylist.items;
      const email = getState().auth?.userData?.email;

      if (email !== GUEST) {
        try {
          //save this playlist to firebase and then add a listener to dispatch when a success is recieved
          await fbStore
            .collection("users")
            .doc(email)
            .update({
              [`${PLAYLISTS.toLowerCase()}.${playlistID}`]: {
                name,
                id: playlistID,
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
          const newPlaylist = {
            ...storagePlaylist,

            [playlistID]: { name, items: createdPlaylist, id: playlistID },
          };

          window.localStorage.setItem(PLAYLISTS, JSON.stringify(newPlaylist));
        }
      }

      dispatch({
        type: SAVEPLAYLIST,
        payload: {
          [playlistID]: { name, id: playlistID, items: createdPlaylist },
        },
      });
    } else {
      //If no name is provided, we are setting the saved playlist from firebase or local storage on app initialisation/update
      const auth = getState().auth;
      if (auth.userData?.displayName === GUEST) {
        const localPLaylists = window.localStorage.getItem(PLAYLISTS);
        if (localPLaylists) {
          const parsedPlaylists = JSON.parse(localPLaylists);
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

export function editPlaylist(playlistID: string): ThunkResult<void> {
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    const playlist = getState().playlists[playlistID];

    dispatch({
      type: EDITPLAYLIST,
      payload: playlist,
    });
  };
}

export function deletePlaylist(playlistID: string): ThunkResult<void> {
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    //Change state and then save playlist
    const playlists = getState().playlists;
    const email = getState().auth?.userData?.email;
    if (email !== GUEST) {
      try {
        //save this playlist to firebase and then add a listener to dispatch when a success is recieved
        await fbStore
          .collection("users")
          .doc(email)
          .update({
            [`${PLAYLISTS.toLowerCase()}.${playlistID}`]: firebase.firestore.FieldValue.delete(),
          });
      } catch (error) {
        console.log(error);
      }

      const playlistsCopy = { ...playlists };
      delete playlistsCopy[playlistID];

      dispatch({
        type: DELETEPLAYLIST,
        payload: playlistsCopy,
      });
    } else {
      //Store in local storage
      const storedPlaylists = window.localStorage.getItem(PLAYLISTS);

      if (storedPlaylists) {
        const storagePlaylist = JSON.parse(storedPlaylists);
        delete storagePlaylist[playlistID];

        window.localStorage.setItem(PLAYLISTS, JSON.stringify(storagePlaylist));

        dispatch({
          type: DELETEPLAYLIST,
          payload: storagePlaylist,
        });
      }
    }
  };
}
