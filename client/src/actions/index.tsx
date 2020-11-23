import axios from "axios";
import { getCookie, setCookie } from "../util/cookie";
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
  UPDATE_SONG_SOURCE,
  TOGGLE_PLAY_STATE,
  playlistItemSongsType,
  SPOTIFY,
  YOUTUBE,
  PLAY_SONG,
  playerStates,
  NEXT_SONG,
  PREV_SONG,
  GUEST,
} from "./types";
import { Dispatch } from "redux";
import { AppState } from "../reducers";
import {
  userData,
  ThunkResult,
  songSearchResult,
  playSongPayload,
  spotifyResult,
  remappedSearchResult,
  updateSongSourcesType,
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

export const alreadySignedIn = (
  email: string,
  displayName: string
): AppActions => {
  return {
    type: SIGN_IN,
    payload: { email, displayName },
  };
};

export const signInAsGuest = (): AppActions => {
  sessionStorage.setItem("guestSignedIn", "1");

  return {
    type: SIGN_IN_AS_GUEST,
    payload: { displayName: GUEST, email: GUEST },
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
let count = 0;
export const spotifySignIn = (): ThunkResult<void> => {
  const accessToken = getCookie("ACCESS_TOKEN");
  return async (dispatch: Dispatch<AppActions | any>) => {
    if (accessToken) {
      //attempt to fetch user Data (also verifies validity of token om failure)
      try {
        const userData: userData | null = await axios.get(
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
        //If its a 401 indicating an expired access token, attempt to get a new one
        if (error?.response?.data.error.status === 401 && !count) {
          //There is always the possibility of an infinite loop with this so I need to keep a count of the number of occurances
          count++;
          const spotifyRefreshToken = getCookie("REFRESH_TOKEN");
          try {
            //Get the new access token using the refresh token
            const accessToken = await axios.get(
              "http://localhost:3000/spotify/refresh_token",
              {
                params: { refresh_token: spotifyRefreshToken },
              }
            );
            //Set the new token as a cookie
            setCookie(
              "ACCESS_TOKEN",
              accessToken.data.access_token,
              accessToken.data.expires_in
            );
            //Try again now that we have new access token
            dispatch(spotifySignIn());
          } catch (error) {
            console.log("Server Error", error);
          }
        }
      }
    }
  };
};

export const songSearch = (title: string): ThunkResult<void> => {
  console.log("searching for song " + title);

  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    const spotifyToken = getCookie("ACCESS_TOKEN");
    const songSources = getState().songSources;
    let songResults;

    if (!title) {
      dispatch({
        type: SONG_SEARCH,
        payload: { spotify: null, youtube: null },
      });
      return;
    }

    try {
      songResults = await axios.get(
        `http://localhost:3000/search/?q=${title}`,
        {
          params: {
            spotifyToken,
            sources: songSources,
          },
        }
      );
    } catch (error) {
      // if (songResults?.data[1]?.error) {
      //   return;
      // }
      console.log(error.response.data);
      return;
    }
    console.log({ songResults: songResults });

    //Sanitise results
    const arrangedResults = {} as songSearchResult;

    console.log({ res: songResults }, songResults.data);

    if (songResults.data.spotifyResults) {
      arrangedResults.spotify =
        (songResults.data.spotifyResults.error &&
          songResults.data.spotifyResults) ||
        remapSongSearchResult(
          SPOTIFY,
          songResults.data.spotifyResults,
          "next",
          "previous",
          "items",
          "album.images.1.url",
          "name",
          "artists.0.name",
          "album.release_date",
          "uri"
        );
    } else {
      arrangedResults.spotify = null;
    }

    if (songResults.data.youtubeResults) {
      arrangedResults.youtube =
        (songResults.data.youtubeResults.error &&
          songResults.data.youtubeResults) ||
        remapSongSearchResult(
          YOUTUBE,
          songResults.data.youtubeResults,
          "nextPageToken",
          "prevPageToken",
          "items",
          "snippet.thumbnails.high.url",
          "snippet.title",
          "snippet.channelTitle",
          "snippet.publishedAt",
          "id.videoId"
        );
    } else {
      arrangedResults.youtube = null;
    }

    console.log({ songResults: songResults });

    //Next page tokens

    dispatch({
      type: SONG_SEARCH,
      payload: arrangedResults,
    });
  };
};

export const playSong = (
  context: playlistItemSongsType[],
  index = 0
):
  | {
      type: playerStates;
      payload: { context: playlistItemSongsType[]; index: number };
    }
  | Record<string, unknown> => {
  if (context) {
    if (context[index] !== undefined) {
      return {
        type: PLAY_SONG,
        payload: { context, index },
      };
    } else {
      return { type: PLAY_SONG, payload: { context, index: 0 } };
    }
  }

  return { type: PLAY_SONG };
};

export const changePlayerState = (
  type: typeof TOGGLE_PLAY_STATE
): {
  type: typeof TOGGLE_PLAY_STATE;
} => {
  return { type };
};

export const nextSong = () => {
  return { type: NEXT_SONG };
};

export const prevSong = () => {
  return { type: PREV_SONG };
};

export const updateSongSources = (
  sources: updateSongSourcesType
): AppActions => {
  console.log({ sources });
  return {
    type: UPDATE_SONG_SOURCE,
    payload: sources,
  };
};
