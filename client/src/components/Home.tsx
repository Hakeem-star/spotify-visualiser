import React, { ReactElement, useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { songSearch } from "../actions";
import { AppActions } from "../actions/types";
import { ThunkResult } from "../types";
import { getCookie } from "../util/cookie";

import { Flex } from "@chakra-ui/core";
import Header from "./Header";
import SearchResultContainer from "./SearchResultContainer";
import YouTubePlayer from "./YouTubePlayer";
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: { Player: any };
    YT: any;
  }
}

function Home(): ReactElement {
  const [ytReady, setYtReady] = useState(false);

  //Load Spotify
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = getCookie("ACCESS_TOKEN");
      const player = new window.Spotify.Player({
        name: "Hakeem in da house Player",
        getOAuthToken: (cb: (a: string | undefined) => void) => {
          cb(token);
        },
      });

      // Error handling
      player.addListener("initialization_error", ({ message }: any) => {
        console.error(message);
      });
      player.addListener("authentication_error", ({ message }: any) => {
        console.error(message);
      });
      player.addListener("account_error", ({ message }: any) => {
        console.error(message);
      });
      player.addListener("playback_error", ({ message }: any) => {
        console.error(message);
      });

      // Playback status updates
      player.addListener("player_state_changed", (state: string) => {
        console.log(state);
      });

      // Ready
      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
      });

      // Not Ready
      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID has gone offline", device_id);
        }
      );

      // Connect to the player!
      player.connect();
    };
  }, []);

  useEffect(() => {
    //insert the Youtube Player API src if not on page
    const tag = document.createElement("script");
    if (!window.YT) {
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName("script")[0];
      // console.log({ first: firstScriptTag.parentNode });
      if (firstScriptTag !== null) {
        firstScriptTag.appendChild(tag);
        tag.onload = () => {
          console.log("DONE", window.YT);
          const clearcheck = setInterval(repeatcheck, 500, 0);
          function repeatcheck(oldvalue: number) {
            if (window.YT.loaded !== oldvalue) {
              // do something
              clearInterval(clearcheck);
              setYtReady(true);
              console.log(
                "check1 value changed from " +
                  oldvalue +
                  " to " +
                  window.YT.loaded
              );
            }
          }
        };
      }
    }
  }, []);

  return (
    <Flex direction="column" h="100vh">
      <Header />
      {/* //If a search is being made, display search Results component */}
      <SearchResultContainer />
      {ytReady ? <YouTubePlayer /> : null}
    </Flex>
  );
}
const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
) => ({});
export default connect(null, mapDispatchToProps)(Home);
