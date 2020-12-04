import React, { ReactElement, useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Flex, useDisclosure } from "@chakra-ui/react";
import Header from "./Header";
import YouTubePlayer from "./YouTubePlayer";
import Player from "./Player";
import ConnectToSpotifyModal from "./ConnectToSpotifyModal";
import useSpotifyPlayer from "./SpotifyPlayer";
import { Visualiser } from "./Visualiser";

import SearchResultWithPlaylistCreator from "./SearchResultWithPlaylistCreator";
import { Route, Switch } from "react-router-dom";
import YourPlaylists from "./YourPlaylists";
import PlaylistDetail from "./PlaylistDetail";
import { AppState } from "../reducers";
import { savePlaylist } from "../actions/playlistActions";
import { spotifySignIn } from "../actions";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: { Player: any };
    YT: any;
  }
}

export default function Home(): ReactElement {
  const [ytReady, setYtReady] = useState(false);
  const dispatch = useDispatch();
  const spotifyAuth = useSelector((state: AppState) => state.spotifyAuth);
  useSpotifyPlayer();

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
          const clearcheck = setInterval(repeatcheck, 500, 0);
          function repeatcheck(oldvalue: number) {
            if (window.YT.loaded !== oldvalue) {
              // do something
              clearInterval(clearcheck);
              setYtReady(true);
              console.log(
                "check value changed from " +
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // const spotifyAccessToken = getCookie("ACCESS_TOKEN");

    dispatch(spotifySignIn());
    // ////Open Spotify Modal when we land on homepage
    // const getSpotifyUser = async () => {
    //   try {
    //     //Check if the user has a token in the cookie (indicating a previous sign in)
    //     const spotifyAccessToken = getCookie("ACCESS_TOKEN");
    //     //If no cookie exists, throw an error. When caught the modal prompting Spotify will show up
    //     if (!spotifyAccessToken) {
    //       throw "No cookie";
    //     }
    //     //If a cookie exists, attempt to get a profile
    //     await axios.get("https://api.spotify.com/v1/me", {
    //       headers: { Authorization: "Bearer " + spotifyAccessToken },
    //     });
    //     //if unsuccessful, an error will be thrown and a refresh token will be retrieved
    //   } catch (error) {
    //     //If its a 401 indicating an expired access token, attempt to get a new one
    //     if (error?.response?.data.error.status === 401) {
    //       const spotifyRefreshToken = getCookie("REFRESH_TOKEN");
    //       console.log({ spotifyRefreshToken });
    //       const newAccessToken = await axios.get(
    //         "http://localhost:3000/spotify/refresh_token",
    //         { params: { refresh_token: spotifyRefreshToken } }
    //       );
    //       console.log(newAccessToken);
    //       onOpen();
    //     }
    //     //if it's any other type of error, open the modal
    //     console.error(error);
    //     onOpen();
    //   }
    // };
    // getSpotifyUser();
  }, []);

  useEffect(() => {
    //Get saved playlists
    //Check if guest
    dispatch(savePlaylist());
  }, []);

  useEffect(() => {
    if (spotifyAuth.isSignedIn === false) {
      console.log({ isSignedIn: spotifyAuth.isSignedIn });
      onOpen();
      // dispatch(spotifySignIn());
    } else {
      onClose();
    }
  }, [spotifyAuth.isSignedIn]);

  //Visualiser state
  const [visualiserOn, setVisualiserOn] = useState(false);
  //Canvas parent ref
  const canvasContainerRef = useRef();

  return (
    <Flex direction="column" h="100vh">
      <Header
        setVisualiserOn={setVisualiserOn}
        connectToSpotifyModalToggle={{ open: onOpen, close: onClose }}
      />
      <Flex
        flex="1"
        position="relative"
        overflow="hidden"
        ref={canvasContainerRef as any}
      >
        {/* {console.log({ CAN: canvasContainerRef.current })} */}
        <Visualiser
          visualiserOn={visualiserOn}
          container={canvasContainerRef as any}
        />
        {/* <SourceSelector
          connectToSpotifyModalToggle={{ open: onOpen, close: onClose }}
        /> */}
        {/* //If a search is being made, display search Results component */}
        <Switch>
          <Route path="/playlists/:id/" component={PlaylistDetail} />

          <Route path="/playlists" component={YourPlaylists} />

          <Route path="/" component={SearchResultWithPlaylistCreator} />
        </Switch>
      </Flex>

      {/* Modal to prompt connection to Spotify */}
      <ConnectToSpotifyModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
      {ytReady ? <YouTubePlayer /> : null}
      <Player />
    </Flex>
  );
}
