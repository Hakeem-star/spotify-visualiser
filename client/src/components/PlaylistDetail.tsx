import { Text, Image, Button, Flex, Grid, Heading } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { playSong } from "../actions";
import { AppState } from "../reducers";
import SearchResult from "./SearchResult";
import Slider from "react-slick";
import useDragDetection from "../util/useDragDetection";
import { css } from "@emotion/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { playlistItemSongsType } from "../actions/types";

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

  const playlist = pathname.includes("/playlists/current")
    ? reff.current
    : playlistRedux;

  const dispatch = useDispatch();

  //Prevents click event on item when attempting to drag
  const { handleMouseDown, dragging } = useDragDetection();

  //Controls the item displayed in image
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  useEffect(() => {
    if (pathname.includes("/playlists/current")) {
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
      name = name[currentItemIndex].name;
    }

    return (
      <Grid
        key={items[0].name}
        className="playlist-detail__container"
        templateRows="0.75fr 50% 1fr"
        templateColumns="1fr 15fr 1fr"
        w="100%"
        h="100%"
      >
        <Flex
          className="playlist-detail__title"
          gridColumn="2/3;"
          gridRow="1/2;"
          justifySelf="center;"
          alignSelf="center;"
          width="50%"
          m="auto 0"
          style={{ alignSelf: "start" }}
        >
          <Heading textAlign="left" flex={1}>
            {name}
          </Heading>
          <Button
            ml="auto"
            onClick={() => {
              console.log(items);
              dispatch(playSong(items, 0, id));
            }}
          >
            Play!
          </Button>
        </Flex>
        <Flex
          w="50%"
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
            h="100%"
            src={items[currentItemIndex].imageUrl[0].url}
          />
          <Flex
            alignSelf="center"
            transform="translateY(-50%)"
            textAlign="right"
            direction="column"
            css={css`
              p {
                margin-bottom: 1rem;
              }
            `}
          >
            <Text title={items[currentItemIndex].name}>
              {items[currentItemIndex].name}
            </Text>
            <Text title={items[currentItemIndex].artist}>
              {items[currentItemIndex].artist}
            </Text>
            <Text>{items[currentItemIndex].duration}</Text>
          </Flex>
        </Flex>
        <Flex
          maxWidth="100%"
          overflow="hidden"
          gridColumn="2/3;"
          gridRow="3/3;"
          className="SLIDEEE"
          alignSelf="end"
          h="80%"
        >
          {/* Thumbnail slider */}
          <div style={{ overflow: "hidden", width: "100%", height: "100%" }}>
            <Slider {...thumbSlidersettings}>
              {items.map((song, index) => {
                console.log({ song: song.url });
                return (
                  <div
                    onMouseDownCapture={handleMouseDown}
                    onClickCapture={(e) => handleChildClick(e, index)}
                    key={song.url}
                    className="VCOVER"
                  >
                    <div style={{ width: "90%" }}>
                      <SearchResult context={items} index={index} {...song} />
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </Flex>
      </Grid>
    );
  } else {
    return <div></div>;
  }
}
