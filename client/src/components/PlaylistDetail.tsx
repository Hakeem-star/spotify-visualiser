import { Button, Flex, Grid, Heading } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { playSong } from "../actions";
import { AppState } from "../reducers";
import SearchResult from "./SearchResult";

export default function PlaylistDetail(): ReactElement {
  const { id }: { id: string } = useParams();
  const playlist = useSelector((state: AppState) => state.playlists[id]);
  const dispatch = useDispatch();
  if (playlist) {
    const { name, items } = playlist;
    return (
      <Grid
        key={name}
        className="playlist-detail__container"
        templateRows="1fr 2fr 1fr"
        templateColumns="1fr auto 1fr"
        // direction="column"
        // align="center"
        // justify="flex-start"
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
        >
          <Heading flex={1}>{name}</Heading>
          <Button
            ml="auto"
            onClick={() => {
              console.log(items);
              dispatch(playSong(items));
            }}
          >
            Play!
          </Button>
        </Flex>
        <Flex gridColumn="2/3;" gridRow="2/3;">
          {items.map((song, index) => {
            return (
              <SearchResult
                context={items}
                key={song.url}
                index={index}
                {...song}
              />
            );
          })}
        </Flex>
      </Grid>
    );
  } else {
    return <div></div>;
  }
}
