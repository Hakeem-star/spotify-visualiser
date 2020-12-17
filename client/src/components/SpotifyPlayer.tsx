import React, { ReactElement, useEffect, useRef } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { nextSong } from "../actions";
import { setCurrentSongDetails } from "../actions/externalPlayerActions";
import { SPOTIFY } from "../actions/types";
import { AppState } from "../reducers";
import { playSongReducedState } from "../reducers/playSongReducer";
import { PLAYER_NAME } from "../util/appVariables";
import { getCookie } from "../util/cookie";
import { debounce } from "../util/debounce";

interface Props {
  play?: () => void;
  pause?: () => void;
  mute?: () => void;
  setVolume?: () => void;
  playerState: playSongReducedState;
}

const debouncedNextSongDispatch = debounce(endSongCheck, 1000);

function endSongCheck(dispatch: Dispatch<any>) {
  console.log("Track ended");
  dispatch(nextSong());
}

export const play = ({
  spotify_uri,
  playerInstance: {
    _options: { getOAuthToken, id },
  },
}: {
  spotify_uri: string;
  playerInstance: {
    _options: { getOAuthToken: (val: (t: string) => void) => void; id: string };
  };
}): void => {
  getOAuthToken((access_token) => {
    try {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        method: "PUT",
        body: JSON.stringify({ uris: [spotify_uri] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
  });
};

export default function useSpotifyPlayer(): void {
  const player: any = useRef(null);
  const previousVidId = useRef("");
  const playerState = useSelector((state: AppState) => state.playerState);
  const externalPlayerSongMeta = useSelector(
    (state: AppState) => state.externalPlayerSongMeta
  );
  const signedIn = useSelector((state: AppState) => state.auth.isSignedIn);

  const dispatch = useDispatch();

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);
  }, []);

  //Load Spotify
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = getCookie("ACCESS_TOKEN");
      console.log({ token });
      player.current = new window.Spotify.Player({
        name: PLAYER_NAME,
        getOAuthToken: (cb: (a: string | undefined) => void) => {
          cb(token);
        },
      });
      console.log({ token: player.current });
      // Error handling
      player.current.addListener("initialization_error", ({ message }: any) => {
        console.log({ player: player.current });
        console.error("initialization_error", message);
      });
      player.current.addListener("authentication_error", ({ message }: any) => {
        console.error(message);
      });
      player.current.addListener("account_error", ({ message }: any) => {
        console.error(message);
      });
      player.current.addListener("playback_error", ({ message }: any) => {
        console.error(message);
      });

      // Playback status updates
      player.current.addListener("player_state_changed", (state: any) => {
        console.log({ spotify: state });

        //Go to next track when finished
        if (
          state.track_window.previous_tracks.find(
            (x: any) => x.id === state.track_window.current_track.id
          ) &&
          state.paused &&
          !state.position
        ) {
          debouncedNextSongDispatch(dispatch);
        } else if (!state.paused) {
          //If not paused, get the position of the player head and add it to state
          player.current.getCurrentState().then((state: any) => {
            console.log({ state });
            const { duration, position } = state;
            // values are ms
            dispatch(
              setCurrentSongDetails({
                duration: duration,
                position: position,
              })
            );
          });
        }
      });

      // Ready
      player.current.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Ready with Device ID", device_id);
        }
      );

      // Not Ready
      player.current.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
        }
      );

      // Connect to the player!
      player.current.connect();
    };
  }, []);

  useEffect(() => {
    //When the URL or the source changes
    if (playerState.source === SPOTIFY) {
      play({
        playerInstance: player.current,
        spotify_uri: playerState.url,
      });
    } else {
      //If we are not playing a Spotify song, stop the Spotify song
      try {
        //We can't stop, but we can pause
        player.current.pause();
      } catch (error) {
        console.log(error);
      }
    }
  }, [playerState?.url, playerState?.source]);

  useEffect(() => {
    if (playerState.source === SPOTIFY) {
      console.log("URL", previousVidId.current, playerState?.url);
      if (previousVidId.current === playerState?.url) {
        //If we have a spotify url and we have clicked on the same song, pause the song
        //Play and stop Spotify song
        if (playerState.play) {
          player.current.resume();
        } else {
          player.current.pause();
        }
      }
    } else {
      //If we are not playing a Spotify song, stop the Spotify song
      try {
        player.current.pause();
      } catch (error) {
        console.log(error);
      }
    }
    previousVidId.current = playerState.url;
  }, [playerState]);

  useEffect(() => {
    //Seeking
    console.log(externalPlayerSongMeta.seekPosition, playerState.source);
    if (playerState.source === SPOTIFY) {
      console.log({ seekPosition: externalPlayerSongMeta.seekPosition });
      player.current.seek(externalPlayerSongMeta.seekPosition * 1000);
    }
  }, [externalPlayerSongMeta.seekPosition]);

  //If signIn status changes
  useEffect(() => {
    //Stop when signed out
    if (!signedIn && player.current) {
      player.current.pause();
    }
  }, [signedIn]);
}
