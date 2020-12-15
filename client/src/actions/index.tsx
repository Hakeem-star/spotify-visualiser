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
  SPOTIFY_SIGN_IN_FAILED,
  FETCHING_SONG_SEARCH,
} from "./types";
import { Dispatch } from "redux";
import { AppState } from "../reducers";
import {
  userData,
  ThunkResult,
  songSearchResult,
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

export const signOut = (displayName: string): ThunkResult<void> => {
  return async (dispatch: Dispatch<AppActions>) => {
    if (displayName === GUEST) {
      sessionStorage.setItem("guestSignedIn", "0");
      dispatch({
        type: SIGN_OUT,
      });
    }
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
            dispatch({
              type: SPOTIFY_SIGN_IN_FAILED,
            });
          }
        }
      }
    }
  };
};

export const songSearch = (title: string): ThunkResult<void> => {
  console.log("searching for song " + title);
  //Need to set state to indicate a search is being made

  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    dispatch({
      type: FETCHING_SONG_SEARCH,
      payload: true,
    });
    const spotifyToken = getCookie("ACCESS_TOKEN");
    const songSources = getState().songSources;
    let songResults;

    //if nothing is searched
    if (!title) {
      let region: any;
      try {
        //Get the users Region
        region = (await axios.get("http://ip-api.com/json")).data.countryCode;
      } catch (error) {
        console.log(error.response.data);
        region = "US";
      }
      try {
        //Get geo location if not already in state,

        songResults = await axios.get(`http://localhost:3000/search/popular`, {
          params: {
            spotifyToken,
            sources: songSources,
            region,
          },
        });
      } catch (error) {
        // if (songResults?.data[1]?.error) {
        //   return;
        // }
        console.log(error.response.data);
        return;
      }
    } else {
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
    }
    console.log({ songResults: songResults });
    //Sanitise results
    const arrangedResults = {} as songSearchResult;

    if (songResults.data.spotifyResults) {
      arrangedResults[SPOTIFY] =
        (songResults.data.spotifyResults.error &&
          songResults.data.spotifyResults) ||
        remapSongSearchResult(
          SPOTIFY,
          songResults.data.spotifyResults,
          "next",
          "previous",
          "items",
          "album.images",
          "name",
          "artists.0.name",
          "album.release_date",
          "uri",
          "duration"
        );
    }

    // else {
    //   arrangedResults[SPOTIFY] = null;
    // }

    if (songResults.data.youtubeResults) {
      if (songResults.data.youtubeResults.error) {
        arrangedResults[YOUTUBE] = songResults.data.youtubeResults;
      } else {
        //server side instead?
        //change the format of the images in the response
        songResults.data.youtubeResults.items.forEach((item: any) => {
          const imageSizes = Object.values(item.snippet.thumbnails).sort(
            (a: any, b: any) => {
              return b.width - a.width;
            }
          );
          item.snippet.thumbnails = [...imageSizes];
        });

        arrangedResults[YOUTUBE] = remapSongSearchResult(
          YOUTUBE,
          songResults.data.youtubeResults,
          "nextPageToken",
          "prevPageToken",
          "items",
          "snippet.thumbnails",
          "snippet.title",
          "snippet.channelTitle",
          "snippet.publishedAt",
          "id.videoId",
          "duration"
        );
      }
    }
    // else {
    //   arrangedResults[YOUTUBE] = null;
    // }

    //Next page tokens

    dispatch({
      type: SONG_SEARCH,
      payload: arrangedResults,
    });
    dispatch({
      type: FETCHING_SONG_SEARCH,
      payload: false,
    });
  };
};

export const playSong = (
  context: playlistItemSongsType[],
  index = 0,
  playlistId = ""
):
  | {
      type: playerStates;
      payload: {
        context: playlistItemSongsType[];
        index: number;
        playlistId: string;
      };
    }
  | Record<string, unknown> => {
  if (context) {
    if (context[index] !== undefined) {
      return {
        type: PLAY_SONG,
        payload: { context, index, playlistId },
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
  return {
    type: UPDATE_SONG_SOURCE,
    payload: sources,
  };
};
