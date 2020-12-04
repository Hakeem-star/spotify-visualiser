import React, { ReactElement } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { AppState } from "../reducers";
import { changePlayerState, nextSong, prevSong } from "../actions";

import { IoIosSkipBackward } from "react-icons/io";
import { Flex, Text } from "@chakra-ui/react";
import { BsPlay, BsPause } from "react-icons/bs";
import { TOGGLE_PLAY_STATE } from "../actions/types";

export default function Player(): ReactElement {
  const dispatch = useDispatch();
  const playerState = useSelector((state: AppState) => state.playerState);

  const { context, index } = playerState;
  console.log({ context: { context, index } });
  return (
    <Flex>
      {/* Current track info */}
      <Flex direction="column" w="30%">
        {context[index] ? (
          <>
            <Text>{context[index].name}</Text>
            <Text>{context[index].artist}</Text>
            <Text>{context[index].duration}</Text>
          </>
        ) : null}
      </Flex>

      <Flex
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
      <Flex w="30%">
        {context[index + 1] ? (
          <>
            <Text height="100%">Next:</Text>
            <Flex direction="column">
              <Text>{context[index + 1]?.name || null}</Text>
              <Text>{context[index + 1]?.artist || null}</Text>
              <Text>{context[index + 1]?.duration || null}</Text>
            </Flex>
          </>
        ) : null}
      </Flex>
    </Flex>
  );
}
