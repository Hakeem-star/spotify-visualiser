import axios from "axios";
import { getCookie, deleteAllCookies } from "../util/cookie";
import { SONG_SEARCH, PLAY_SONG, SIGN_IN, SIGN_OUT, AppActions } from "./types";
import { Dispatch } from "redux";
import { AppState } from "../reducers";
import {
  userData,
  ThunkResult,
  youtubeResult,
  spotifyResult,
  songSearchResult,
} from "../types";
import { remapSongSearchResult } from "../util/remapSongSearchResult";

export const signIn = (): ThunkResult<void> => {
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
          type: SIGN_IN,
          payload: { userData, spotifyToken: accessToken },
        });
      } catch (error) {
        console.log("Not logged in");
      }
    }
  };
};

export const signOut = (): AppActions => {
  deleteAllCookies();
  return {
    type: SIGN_OUT,
  };
};

export const songSearch = (title: string): ThunkResult<void> => {
  console.log("searching for song " + title);
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    const spotifyToken = getState().auth.spotifyToken;
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
      songResults.data[0] as Record<string, any>,
      "next",
      "previous",
      "items",
      "album.images.1.url",
      "name",
      "artists.0.name",
      "album.release_date",
      "uri"
    );
    console.log({ spotify: arrangedResults.spotify });
    arrangedResults.youtube = remapSongSearchResult(
      songResults.data[1] as Record<string, any>,
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

export const playSong = (id: string, type: string): ThunkResult<void> => {
  //Check if Spotify or Youtube song

  if (type === "youtube") {
    return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
      const spotifyToken = getState().auth.spotifyToken;
      const songResults = await axios.get(`http://localhost:3000/search/`, {
        params: {},
      });

      //Sanitise results

      //Next page tokens

      console.log(songResults.data);
      dispatch({
        type: "PLAY_SONG",
        payload: { id, type },
      });
    };
  }

  //Do something
  return async (dispatch: Dispatch<AppActions>, getState: () => AppState) => {
    const spotifyToken = getState().auth.spotifyToken;
    const songResults = await axios.get(`http://localhost:3000/search/`, {
      params: {},
    });

    //Sanitise results

    //Next page tokens

    console.log(songResults.data);
    // dispatch({
    //   type: SONG_SEARCH,
    //   payload:null
    // });
  };
};
