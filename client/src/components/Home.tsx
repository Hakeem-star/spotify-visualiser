import React, { ReactElement, useState, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { songSearch } from "../actions";
import { AppActions } from "../actions/types";
import { ThunkResult } from "../types";
import { getCookie } from "../util/cookie";

import {
  Checkbox,
  CheckboxGroup,
  Flex,
  List,
  Modal,
  Text,
} from "@chakra-ui/core";
import Header from "./Header";
import SearchResultContainer from "./SearchResultContainer";
import YouTubePlayer from "./YouTubePlayer";
import Player from "./Player";
import ConnectToSpotify from "./ConnectToSpotify";
import { PLAYER_NAME } from "../util/appVariables";
import SpotifyPlayer from "./SpotifyPlayer";
import { Visualiser } from "./Visualiser";
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: { Player: any };
    YT: any;
  }
}

export default function Home(): ReactElement {
  const [ytReady, setYtReady] = useState(false);

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
      <Flex flex="1">
        <Flex height="100%" w="10%" background="red" position="fixed">
          <CheckboxGroup mt="50px" defaultValue={["Youtube"]}>
            <Checkbox value="Spotify">Spotify</Checkbox>
            <Checkbox value="Youtube">Youtube</Checkbox>
          </CheckboxGroup>
        </Flex>
        {/* //If a search is being made, display search Results component */}
        <SearchResultContainer />
      </Flex>
      {/* Modal to prompt connection to Spotify */}
      <ConnectToSpotify />

      <SpotifyPlayer />
      {ytReady ? <YouTubePlayer /> : null}
      <Visualiser />
      <Player />
    </Flex>
  );
}
