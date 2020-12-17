/** @jsx jsx */
import {
  Box,
  Flex,
  Grid,
  Image,
  Text,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { css, jsx } from "@emotion/react";
import { ReactElement, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playSong } from "../actions";
import {
  addToDragNDrop,
  removeFromDragNDrop,
} from "../actions/createPlaylistDragDropActions";
import { playlistItemSongsType } from "../actions/types";
import { CgPlayListCheck } from "react-icons/cg";
import { BsPlay, BsPause } from "react-icons/bs";
import { AppState } from "../reducers";
import { useMobileBreakpoint } from "../util/mobileBreakpoint";

interface Props extends playlistItemSongsType {
  index?: number;
  context: playlistItemSongsType[];
  playlistItem?: boolean;
}

export default function SearchResult(props: Props): ReactElement {
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(0);
  const createPLaylistItems = useSelector(
    (state: AppState) => state.createPlaylist.items
  );
  const mobileScreenSize = useMobileBreakpoint();

  const playerState = useSelector((state: AppState) => state.playerState);
  const {
    imageUrl,
    name,
    artist,
    duration,
    url,
    index,
    source,
    playlistItem,
  } = props;

  const [inPlaylist, setInPlaylist] = useState(() =>
    Boolean(createPLaylistItems.find((item) => item.url === url))
  );

  function PlayState() {
    if (playerState.url === url) {
      return playerState.play ? (
        <BsPause
          style={{ width: "40%", height: "40%", opacity: 0.3 }}
          title="Pause"
        />
      ) : (
        <BsPlay
          style={{ width: "40%", height: "40%", opacity: 0.3 }}
          title="Play"
        />
      );
    }

    return (
      <BsPlay
        style={{ width: "40%", height: "40%", opacity: 0.3 }}
        title="Play"
      />
    );
  }

  return (
    <Tooltip label={name} isDisabled={mobileScreenSize}>
      <Flex
        position="relative"
        height="95px"
        color="white"
        w="100%"
        borderRadius="5px"
        overflow="hidden"
        onClick={() => {
          console.log({ context: props.context });
          dispatch(playSong(props.context, index));
        }}
        //remove dark gradient on hover
        css={css`
          :hover {
            .SearchResult__image::before {
              opacity: 0.3;
            }
          }
          .PlayBox,
          .CheckBox {
            :hover {
              svg {
                transform: scale(1.5);
              }
            }
            svg {
              transition: transform 0.3s;
            }
          }
        `}
      >
        {/* If checkbox option is ticked... */}
        {/* Checkbox and playbox for secondary method of adding to playlist */}
        {playlistItem ? (
          <Flex
            cursor="pointer"
            position="absolute"
            top="0"
            left="0"
            width="100%"
            h="100%"
            zIndex="2"
          >
            <Grid
              w="50%"
              h="100%"
              placeItems="center"
              className="CheckBox"
              position="relative"
              onClick={(e) => {
                e.stopPropagation();
                //This should also open the createPlaylist sidebar when clicked
                //Need to check if it already exists in playlist so we know to remove it when clicked
                if (inPlaylist) {
                  dispatch(removeFromDragNDrop(index || 0));
                  setInPlaylist(false);
                } else {
                  dispatch(
                    addToDragNDrop({ droppableId: source, index: index || 0 })
                  );
                  setInPlaylist(true);
                }
              }}
            >
              <CgPlayListCheck
                title="Add to Playlist"
                id="mask"
                style={{
                  width: "40%",
                  height: "40%",
                  opacity: 0.3,
                }}
                css={css`
                  transition: filter 0.3s;
                  //Last path is the tick. Select that and make it green
                  path:last-child {
                    color: ${`${inPlaylist ? "green" : "inherit"}`};
                    transition: color 0.3s;
                  }
                `}
              />
            </Grid>

            <Grid
              w="50%"
              h="100%"
              placeItems="center"
              className="PlayBox"
              onClick={(e) => {
                //Prevent the click event from going to other div, so playsong isn't dispatched twice
                e.stopPropagation();
                dispatch(playSong(props.context, index));
              }}
            >
              {PlayState()}
            </Grid>
          </Flex>
        ) : null}
        <Image
          position="absolute"
          top={0}
          left={0}
          width="100%"
          transform="translateY(-25%)"
          transition="opacity 0.1s"
          //Loads the gradient overlay when we have an image.
          opacity={imageLoaded}
          onLoad={() => setImageLoaded(1)}
          // maxW="124px"
          src={imageUrl[0].url}
          fit="contain"
          alt={name}
        />

        <Flex
          justifyContent="center"
          fontSize="0.8em"
          flexDirection="column"
          p="5px"
          w="50%"
          flex="1"
          className="SearchResult__image"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: imageLoaded,
            background:
              "linear-gradient(180deg, rgb(84 84 84 / 0%) 0%, rgb(0 0 0) 0%, rgb(33 33 33 / 40%) 100%)",
            zIndex: "-1",
            transition: "opacity 0.3s",
          }}
          zIndex={1}
        >
          <Flex alignItems="center" h="50%">
            <Text
              overflow="hidden"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              // textShadow="0.5px 0 0 #f00, 0 -0.5px 0 #ff5e00, 0 0.5px 0 #f00, -0.5px 0 0 #ff6a00"
              css={css`
                // This needs to be animated to move the text so we can read the entire name
                // text-indent: 1rem;
              `}
            >
              {name}
            </Text>
          </Flex>
          <Flex flexDirection="column" h="50%">
            <Text>{artist}</Text>
            <Text>{duration}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Tooltip>
  );
}
