import React, { ReactElement, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { SPOTIFY } from "../actions/types";
import { AppState } from "../reducers";
import { playSongReducedState } from "../reducers/playSongReducer";
import { PLAYER_NAME } from "../util/appVariables";
import { getCookie } from "../util/cookie";

interface Props {
  play?: () => void;
  pause?: () => void;
  mute?: () => void;
  setVolume?: () => void;
  playerState: playSongReducedState;
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
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [spotify_uri] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });
  });
};

function SpotifyPlayer({ playerState }: Props): ReactElement {
  const player: any = useRef(null);
  const previousVidId = useRef("");

  //Load Spotify
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = getCookie("ACCESS_TOKEN");
      player.current = new window.Spotify.Player({
        name: PLAYER_NAME,
        getOAuthToken: (cb: (a: string | undefined) => void) => {
          cb(token);
        },
      });

      // Error handling
      player.current.addListener("initialization_error", ({ message }: any) => {
        console.error(message);
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
      player.current.addListener("player_state_changed", (state: string) => {
        console.log(state);
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
  }, [playerState.url, playerState.source]);

  useEffect(() => {
    if (playerState.source === SPOTIFY) {
      console.log("URL", previousVidId.current, playerState?.url);
      if (previousVidId.current === playerState?.url) {
        if (playerState.play) {
          //If we have a spotify url and we have clicked on the same song, pause the song
          //Play and stop Spotify song
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

  return <></>;
}

const mapStateToProps = (state: AppState) => ({
  playerState: state.playerState,
});
export default connect(mapStateToProps)(SpotifyPlayer);