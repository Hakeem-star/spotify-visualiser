import React, { ReactElement, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { AppState } from "../reducers";
import { changePlayerState, nextSong, prevSong } from "../actions";

import { IoIosSkipBackward } from "react-icons/io";
import {
  Box,
  Flex,
  Grid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { BsPlay, BsPause } from "react-icons/bs";
import { TOGGLE_PLAY_STATE } from "../actions/types";
import { css } from "@emotion/react";

export default function Player(): ReactElement {
  const dispatch = useDispatch();
  const playerState = useSelector((state: AppState) => state.playerState);
  const songMeta = useSelector(
    (state: AppState) => state.externalPlayerSongMeta
  );

  const { context, index } = playerState;
  console.log({ context: playerState });

  useEffect(() => {
    //If a new track is playing, get the position of the track and match it to the slider position
  }, [songMeta]);

  return (
    <Flex direction="column">
      <Slider defaultValue={30}>
        <SliderTrack bg="red.100">
          <SliderFilledTrack bg="tomato" />
        </SliderTrack>
        <SliderThumb boxSize={6}>
          <Box color="tomato" />
        </SliderThumb>
      </Slider>

      <Grid
        templateColumns="1fr 1.3fr 1fr"
        p="0 30px"
        alignItems="center"
        css={css``}
      >
        {/* Current track info */}

        <Flex justifyContent="flex-end">
          {context[index] ? (
            <>
              <Text height="100%" mr="10%">
                Now Playing:
              </Text>
              <Flex direction="column">
                <Text>{context[index].name}</Text>
                <Text>{context[index].artist}</Text>
                <Text>{context[index].duration}</Text>
              </Flex>
            </>
          ) : null}
        </Flex>
        <Flex
          style={{ justifySelf: "center" }}
          width="30%"
          alignSelf="center"
          mt="auto"
          height="10vh"
          justifyContent="center"
          alignItems="center"
        >
          <IoIosSkipBackward
            onClick={() => {
              dispatch(prevSong());
            }}
            fontSize="6rem"
          />
          {playerState.play ? (
            <BsPause
              onClick={() => {
                dispatch(changePlayerState(TOGGLE_PLAY_STATE));
              }}
              fontSize="6rem"
            />
          ) : (
            <BsPlay
              onClick={() => {
                dispatch(changePlayerState(TOGGLE_PLAY_STATE));
              }}
              fontSize="6rem"
            />
          )}
          <IoIosSkipBackward
            onClick={() => {
              dispatch(nextSong());
            }}
            transform="scale(-1)"
            fontSize="6rem"
          />
        </Flex>
        {/* Next track info */}
        <Flex w="100%">
          {context[index + 1] ? (
            <>
              <Text height="100%" mr="10%">
                Next:
              </Text>
              <Flex direction="column">
                <Text>{context[index + 1]?.name || null}</Text>
                <Text>{context[index + 1]?.artist || null}</Text>
                <Text>{context[index + 1]?.duration || null}</Text>
              </Flex>
            </>
          ) : null}
        </Flex>
      </Grid>
    </Flex>
  );
}
