import { Text, Image, Button, Flex, Grid, Heading } from "@chakra-ui/react";
import React, { ReactElement, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { playSong } from "../actions";
import { AppState } from "../reducers";
import SearchResult from "./SearchResult";
import Slider from "react-slick";
import useDragDetection from "../util/useDragDetection";
import { css } from "@emotion/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  const { id }: { id: string } = useParams();
  const playlist = useSelector((state: AppState) => state.playlists[id]);
  const dispatch = useDispatch();
  //Prevents click event on item when attempting to drag
  const { handleMouseDown, dragging } = useDragDetection();
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
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
    const { name, items } = playlist;
    return (
      <Grid
        key={name}
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
              console.log({ playlistId3: id });
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
              {items.map((song, index) => (
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
              ))}
            </Slider>
          </div>
        </Flex>
      </Grid>
    );
  } else {
    return <div></div>;
  }
}
