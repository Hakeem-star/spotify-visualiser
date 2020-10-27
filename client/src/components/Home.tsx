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
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: { Player: any };
  }
}

function Home(): ReactElement {
  const [state, setstate] = useState("");

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
  return (
    <Flex direction="column" h="100vh">
      <Header />
      {/* //If a search is being made, display search Results component */}
      <SearchResultContainer />
    </Flex>
  );
}
const mapDispatchToProps = (
  dispatch: ThunkDispatch<any, any, AppActions>
) => ({});
export default connect(null, mapDispatchToProps)(Home);
