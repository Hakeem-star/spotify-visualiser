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
  const dispatch = useDispatch();
  const spotifyAuth = useSelector((state: AppState) => state.spotifyAuth);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    //TODO
    //Attempt to sign into Spotify. I would expect this to keep us signed in at all times but it doesn't seem to
    dispatch(spotifySignIn());

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
        <Player
          setVisualiserFullscreen={setVisualiserFullscreen}
          setVisualiserPrompt={setVisualiserPrompt}
          toggleVisualiserOn={toggleVisualiserOn}
          setToggleVisualiserOn={setToggleVisualiserOn}
        />
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
