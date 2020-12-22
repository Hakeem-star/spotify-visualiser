import {
  Text,
  Image,
  Button,
  Flex,
  Grid,
  Heading,
  VStack,
  Box,
  HStack,
} from "@chakra-ui/react";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useParams } from "react-router-dom";
import { playSong } from "../actions";
import { AppState } from "../reducers";
import SearchResult from "./SearchResult";
import Slider from "react-slick";
import useDragDetection from "../util/useDragDetection";
import { css } from "@emotion/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { playlistItemSongsType } from "../actions/types";
import { SearchListMaker } from "./SearchListMaker";

const mainSlidersettings = {
  focusOnSelect: true,
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 3,
};

const thumbSlidersettings = {
  focusOnSelect: true,
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 3,
};

export default function PlaylistDetail(): ReactElement {
  const {
    location: { pathname },
  } = useHistory();
  const { id }: { id: string } = useParams();

  const playerState = useSelector((state: AppState) => state.playerState);
  const { context, index, playlistId } = playerState;

  const playlistRedux = useSelector(
    (state: AppState) => state.playlists[id]
  ) as {
    name: string | playlistItemSongsType[];
    id: string;
    items: playlistItemSongsType[];
  };
  const reff = useRef({
    name: context,
    items: context,
    id: playlistId,
  });

  const playlist = pathname.includes("/current") ? reff.current : playlistRedux;

  const dispatch = useDispatch();

  //Prevents click event on item when attempting to drag
  const { handleMouseDown, dragging } = useDragDetection();

  //Controls the item displayed in image
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  useEffect(() => {
    if (pathname.includes("/current")) {
      //Use the index from the song clicked so the carousel starts at the right song
      setCurrentItemIndex(index);
    } else {
      setCurrentItemIndex(0);
    }
  }, [pathname]);

  function handleChildClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ): void {
    if (dragging) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      setCurrentItemIndex(index);
      e.preventDefault();
      e.stopPropagation();
    }
  }

  if (playlist) {
    const { items } = playlist;
    let { name } = playlist;
    if (typeof name !== "string") {
      // name = name[currentItemIndex].name;
      name = "Current Queue";
    }

    return (
      <Grid
        key={items[0].name}
        className="playlist-detail__container"
        templateRows="100px minmax(500px,3fr) auto"
        templateColumns="1fr 1.6fr"
        w="100%"
        h="100%"
        p="50px 7% 0"
      >
        <Flex
          maxWidth="100%"
          gridColumn="2/3;"
          gridRow="3/3;"
          className="SLIDEEE"
          h="80%"
          gridArea="1/1/4/2"
          flexDirection="column"
          overflow="visible"
          css={css`
            .SearchResultList__VerticalStack {
              flex-wrap: wrap;
              gap: 20px;
              overflow: scroll;
              min-height: 350px;
              height: 750px;
              padding-bottom: 150px;
            }
            .DraggableSearchResult {
              margin: 0;
              &__skeleton {
                margin: 0;
              }
            }
          `}
        >
          <VStack>
            <HStack>
              <Heading textAlign="left" flex={1}>
                {name}
              </Heading>
              <Button
                onClick={() => {
                  console.log(items);
                  dispatch(playSong(items, 0, id));
                }}
              >
                Play!
              </Button>
            </HStack>
            <Text>
              {items.length + " song" + (items.length > 1 ? "s" : "")}
            </Text>
          </VStack>
          <SearchListMaker
            results={{ next: "", previous: "", items }}
            fetching={false}
            id={""}
          />

          {/* Thumbnail slider */}
          {/* <VStack style={{ overflow: "auto", width: "100%", height: "100%" }}>
            {items.map((song, index) => {
              return (
                <Box
                  w="100%"
                  onMouseDownCapture={handleMouseDown}
                  onClickCapture={(e) => handleChildClick(e, index)}
                  key={song.url}
                  className="VCOVER"
                >
                  <SearchResult context={items} index={index} {...song} />
                </Box>
              );
            })}
          </VStack> */}
        </Flex>

        <VStack
          gridArea="1/2/-1/-1"
          w="100%"
          justify="space-between"
          gridColumn="2/3"
          gridRow="2/2"
          justifySelf="center"
        >
          <Image
            onClick={() => {
              dispatch(playSong(items, currentItemIndex, id));
            }}
            cursor="pointer"
            maxH="100%"
            src={items[currentItemIndex].imageUrl[0].url}
          />
          <Flex
            alignSelf="center"
            transform="translateY(-50%)"
            textAlign="left"
            direction="column"
            w="100%"
            css={css`
              p {
                margin-bottom: 1rem;
              }
            `}
          >
            <Text title={items[currentItemIndex].name}>
              {items[currentItemIndex].name}
            </Text>
            <HStack justify="space-between">
              <Text title={items[currentItemIndex].artist}>
                {items[currentItemIndex].artist}
              </Text>
              <Text>{items[currentItemIndex].duration}</Text>
            </HStack>
          </Flex>
        </VStack>
      </Grid>
    );
  } else {
    return <Redirect to="/" />;
  }
}
