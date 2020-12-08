import React, {
  ReactElement,
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
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
import { AnimationControls, motion, useAnimation } from "framer-motion";
import { css } from "@emotion/react";
import { debounce } from "../util/debounce";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: { Player: any };
    YT: any;
  }
}

const viewFadeOutAnimation = { opacity: 0, transition: { duration: 4 } };
const viewFadeInAnimation = { opacity: 1 };

//This will fade out every 3 seconds
const debouncedViewFadeOutAnimation = debounce(
  (controls, setToggleVisualiserOn) => {
    setToggleVisualiserOn((state: boolean) => {
      state && controls.start(viewFadeOutAnimation);
      return state;
    });
  },
  3000
);

const viewFadeSetup = (
  controls: AnimationControls,
  setToggleVisualiserOn: Dispatch<SetStateAction<boolean>>
) => {
  return () => {
    //we attempt to fade in because the mouse has been moved
    controls.start(viewFadeInAnimation);
    debouncedViewFadeOutAnimation(controls, setToggleVisualiserOn);
  };
};

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
  const [toggleVisualiserOn, setToggleVisualiserOn] = useState(false);
  const [visualiserPrompt, setVisualiserPrompt] = useState(false);

  const [visualiserFullscreen, setVisualiserFullscreen] = useState(false);

  //Canvas parent ref
  const canvasContainerRef = useRef();

  const controls = useAnimation();

  useEffect(() => {
    //Pass through setToggleVisualiserOn so we can use the latest state when debounced
    const viewFade = viewFadeSetup(controls, setToggleVisualiserOn);

    if (toggleVisualiserOn) {
      window.addEventListener("mousemove", viewFade);
    } else {
      window.removeEventListener("mousemove", viewFade);
      controls.start(viewFadeInAnimation);
    }
    return () => {
      window.removeEventListener("mousemove", viewFade);
    };
  }, [toggleVisualiserOn, controls]);

  return (
    <Flex direction="column" h="100vh" ref={canvasContainerRef as any}>
      {/* Fade out everything after inactive for 5 seconds when visualiser is on */}
      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
        animate={controls}
      >
        <Header
          setVisualiserFullscreen={setVisualiserFullscreen}
          setVisualiserPrompt={setVisualiserPrompt}
          toggleVisualiserOn={toggleVisualiserOn}
          setToggleVisualiserOn={setToggleVisualiserOn}
          connectToSpotifyModalToggle={{ open: onOpen, close: onClose }}
        />
        <Flex flex="1" position="relative" overflow="hidden">
          {/* {console.log({ CAN: canvasContainerRef.current })} */}

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
      </motion.div>

      <Visualiser
        setVisualiserFullscreen={setVisualiserFullscreen}
        visualiserFullscreen={visualiserFullscreen}
        setVisualiserPrompt={setVisualiserPrompt}
        visualiserPrompt={visualiserPrompt}
        toggleVisualiserOn={toggleVisualiserOn}
        setToggleVisualiserOn={setToggleVisualiserOn}
        container={canvasContainerRef as any}
      />
    </Flex>
  );
}
