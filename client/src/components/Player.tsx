import React, { ReactElement } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { AppState } from "../reducers";
import { changePlayerState, nextSong, prevSong } from "../actions";

import { IoIosSkipBackward } from "react-icons/io";
import { Flex } from "@chakra-ui/react";
import { BsPlay, BsPause } from "react-icons/bs";
import { TOGGLE_PLAY_STATE } from "../actions/types";

export default function Player(): ReactElement {
  const dispatch = useDispatch();
  const playerState = useSelector((state: AppState) => state.playerState);
  return (
    <Flex
      // display="none"
      width="30%"
      position="fixed"
      bottom="0"
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
  );
}
