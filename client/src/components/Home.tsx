import React, {
  ReactElement,
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { css } from "@emotion/react";
import { Box, Flex, Grid, Heading, useDisclosure } from "@chakra-ui/react";
import SideNav from "./SideNav";
import Player from "./Player";
import ConnectToSpotifyModal from "./ConnectToSpotifyModal";
import { Visualiser } from "./Visualiser";

import SearchResultWithPlaylistCreator from "./SearchResultWithPlaylistCreator";
import { Route, Switch, useHistory } from "react-router-dom";
import YourPlaylists from "./YourPlaylists";
import PlaylistDetail from "./PlaylistDetail";
import { AppState } from "../reducers";
import { savePlaylist } from "../actions/playlistActions";
import { spotifySignIn } from "../actions";
import { AnimationControls, motion, useAnimation } from "framer-motion";
import { debounce } from "../util/debounce";
import Header from "./Header";
import { useMobileBreakpoint } from "../util/mobileBreakpoint";
import { SearchBar } from "./SearchBar";
import { DragDropContext } from "react-beautiful-dnd";
import {
  removeFromDragNDrop,
  reorderDragNDrop,
  addToDragNDrop,
} from "../actions/createPlaylistDragDropActions";
import CreatePlaylist from "./CreatePlaylist";
import PopularResults from "./PopularResults";
import RecentlyListened from "./RecentlyListened";
import SearchResultContainer from "./SearchResultContainer";

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
  const songSearchResults = useSelector(
    (state: AppState) => state.songSearchResult
  );
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

  const mobileScreenSize = useMobileBreakpoint();

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
    <DragDropContext
      onDragEnd={({ source, destination }) => {
        // dropped outside the list
        if (!destination) {
          dispatch(removeFromDragNDrop(source.index));
          return;
          //delete from playlist
        }
        //If it's from the created playlist...reorder
        if (
          source.droppableId === "createPlaylist" &&
          destination.droppableId === "createPlaylist"
        ) {
          dispatch(reorderDragNDrop(source.index, destination.index));
          return;
        }

        //If it is a different column
        if (destination.droppableId === "createPlaylist") {
          dispatch(addToDragNDrop(source, destination));
        }
      }}
    >
      <Flex direction="column" h="100vh" ref={canvasContainerRef as any}>
        {/* Fade out everything after inactive for 5 seconds when visualiser is on */}
        <motion.div
          style={{
            display: `${mobileScreenSize ? "flex" : "grid"}`,
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            gridTemplate: "auto 120px / 230px auto",
          }}
          animate={controls}
        >
          {/* Change header to sidenav when device changes */}
          {/* NAVIGATION */}

          {mobileScreenSize ? (
            <Header
              connectToSpotifyModalToggle={{ open: onOpen, close: onClose }}
            />
          ) : (
            <>
              {/* Show Sidebar and search bar on top when on desktop */}
              <Box gridArea="1/1/2/2" position="relative">
                <SideNav
                  connectToSpotifyModalToggle={{ open: onOpen, close: onClose }}
                />
                <CreatePlaylist />
              </Box>
            </>
          )}

          {/* MAIN CONTENT*/}
          <Grid
            templateColumns="65% 1fr"
            templateRows="3rem minmax(25rem,1fr) 1fr"
            flex="1"
            position="relative"
            overflow="hidden"
            gridArea="1/2/2/3"
            p="30px"
          >
            {!mobileScreenSize ? (
              <Box>
                <SearchBar />
              </Box>
            ) : null}
            <Switch>
              <Route path="/search">
                <Box
                  gridArea="2/1/4/3"
                  css={css`
                    & > .SearchResultList__VerticalStack {
                      flex-wrap: wrap;
                      gap: 20px;
                    }
                    & > .DraggableSearchResult {
                      margin: 0;
                      &__skeleton {
                        margin: 0;
                      }
                    }
                  `}
                >
                  <SearchResultContainer
                    songSearchResults={songSearchResults}
                  />
                </Box>
              </Route>
              {/* Current playlist */}

              <Route path="/current">
                <Box className="FOOOOOL" gridArea="2/1/4/3">
                  <PlaylistDetail />
                </Box>
              </Route>

              {/* Content for the home page */}
              <Route path="/">
                <Flex direction="column" gridArea="2/1/3/2">
                  <PopularResults />
                </Flex>

                <Flex direction="column" gridArea="1/2/3/3">
                  <Heading fontSize="md">Recently Listened</Heading>
                  <RecentlyListened />
                </Flex>

                <Flex direction="column" gridArea="3/1/4/3">
                  <Heading fontSize="md">Playlists</Heading>
                  <YourPlaylists />
                </Flex>
              </Route>
            </Switch>

            {/* If a search is being made, display search Results component */}

            {/* <Switch>
              <Route path="/playlists/:id/" component={PlaylistDetail} />

              <Route path="/playlists" component={YourPlaylists} />

              <Route path="/" component={SearchResultWithPlaylistCreator} />
            </Switch> */}
          </Grid>

          {/* Modal to prompt connection to Spotify */}
          <ConnectToSpotifyModal
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
          />

          {/* PLAYER */}
          <Box gridArea="2/1/-1/-1">
            <Player
              setVisualiserFullscreen={setVisualiserFullscreen}
              setVisualiserPrompt={setVisualiserPrompt}
              toggleVisualiserOn={toggleVisualiserOn}
              setToggleVisualiserOn={setToggleVisualiserOn}
            />
          </Box>
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
    </DragDropContext>
  );
}
