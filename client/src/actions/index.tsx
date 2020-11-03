import axios from "axios";
import { getCookie } from "../util/cookie";
import {
  SONG_SEARCH,
  SIGN_IN,
  SIGN_OUT,
  SIGN_UP,
  AppActions,
  SPOTIFY_SIGN_IN,
  SIGN_IN_AS_GUEST,
  signInAsGuestType,
  FAILED_AUTH_FORM,
} from "./types";
import { Dispatch } from "redux";
import { AppState } from "../reducers";
import {
  userData,
  ThunkResult,
  songSearchResult,
  playSongPayload,
} from "../types";
import { remapSongSearchResult } from "../util/remapSongSearchResult";
import { fbAuth, fbStore } from "../util/firebase_init";

export const signUp = (
  email: string,
  password: string,
  setSubmitting: (boolean: boolean) => void,
  displayName = ""
): ThunkResult<void> => {
  return async (dispatch: Dispatch<AppActions>) => {
    try {
      //Create user
      await fbAuth.createUserWithEmailAndPassword(email, password);
      await fbAuth.currentUser?.updateProfile({
        displayName,
      });
      //Add user to firestore
      await fbStore.collection("users").doc(email).set({ displayName, email });
      //dispatch to reducer so we can keep track of the user in the app
      dispatch({
        type: SIGN_UP,
        payload: { displayName, email },
      });
    } catch (error) {
      console.log("OOps Error", JSON.stringify(error));
      if (error) {
        //Reset form
        setSubmitting(false);
        dispatch({
          type: FAILED_AUTH_FORM,
          payload: error.message,
        });
      }
    }
  };
};

export const signIn = (
  email: string,
  password: string,
  setSubmitting: (boolean: boolean) => void
): ThunkResult<void> => {
  return async (dispatch: Dispatch<AppActions>) => {
    try {
      await fbAuth.signInWithEmailAndPassword(email, password);
      //If we are able to sign in, get display name from store using email
      const doc = await fbStore.collection("users").doc(email).get();

      let displayName = "";
      if (!doc.exists) {
        displayName = email;
      } else {
        console.log("Document data:", doc.data());
        displayName = doc.data()?.displyName;
      }
      dispatch({
        type: SIGN_IN,
        payload: { email, displayName },
      });
    } catch (error) {
      if (error) {
        //Reset form
        setSubmitting(false);
        console.error("OOps Error", error);
        dispatch({
          type: FAILED_AUTH_FORM,
          payload: error.message,
        });
      }
    }
  };
};

export const signInAsGuest = (): signInAsGuestType => {
  return {
    type: SIGN_IN_AS_GUEST,
    payload: { displayName: "Guest", email: "Guest" },
  };
};

export const signOut = (): ThunkResult<void> => {
  return async (dispatch: Dispatch<AppActions>) => {
    try {
      await fbAuth.signOut();
      dispatch({
        type: SIGN_OUT,
      });
    } catch (error) {
      console.error("OOps Error", error);
    }
  };
};

export const spotifySignIn = (): ThunkResult<void> => {
  const accessToken = getCookie("ACCESS_TOKEN");
  return async (dispatch: Dispatch<AppActions>) => {
    if (accessToken) {
      //attempt to fetch user Data (also verifies validity of token om failure)
      try {
        const userData: userData = await axios.get(
          "https://api.spotify.com/v1/me",
          {
            headers: { Authorization: "Bearer " + accessToken },
          }
        );
        dispatch({
          type: SPOTIFY_SIGN_IN,
          payload: { userData, spotifyToken: accessToken },
        });
      } catch (error) {
        console.log("Not logged in");
      }
    }
  };
};

export const songSearch = (title: string): ThunkResult<void> => {
  console.log("searching for song " + title);
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    const spotifyToken = getState().spotifyAuth.spotifyToken;
    console.log("proper searching for song " + title);

    const songResults = await axios.get(
      `http://localhost:3000/search/?q=${title}`,
      {
        params: {
          spotifyToken,
        },
      }
    );

    if (songResults?.data[1]?.error) {
      return;
    }
    console.log({ songResults: songResults });

    //Sanitise results
    const arrangedResults: songSearchResult = { spotify: {}, youtube: {} };

    arrangedResults.spotify = remapSongSearchResult(
      songResults.data[0],
      "next",
      "previous",
      "items",
      "album.images.1.url",
      "name",
      "artists.0.name",
      "album.release_date",
      "uri"
    );
    arrangedResults.youtube = remapSongSearchResult(
      songResults.data[1],
      "nextPageToken",
      "prevPageToken",
      "items",
      "snippet.thumbnails.high.url",
      "snippet.title",
      "snippet.channelTitle",
      "snippet.publishedAt",
      "id.videoId"
    );

    //Next page tokens

    dispatch({
      type: SONG_SEARCH,
      payload: arrangedResults,
    });
  };
};

export const playSong = (
  type: string,
  id?: string | null,
  details?: {
    imageUrl: string;
    name: string;
    artist: string;
    year: string;
    url: string;
  } | null
): { type: string; payload?: playSongPayload } => {
  if (id && details) {
    //Check if Spotify or Youtube song
    return {
      type: type,
      payload: { id, type, details },
    };
  } else {
    return {
      type: type,
    };
  }
};
