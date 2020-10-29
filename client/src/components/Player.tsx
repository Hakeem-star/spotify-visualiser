import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { AppState } from "../reducers";
import { playSong } from "../actions";

import { IoIosSkipBackward } from "react-icons/io";
import { Flex } from "@chakra-ui/core";
import { BsPlay, BsPause } from "react-icons/bs";
import { TOGGLE_PLAY_STATE } from "../actions/types";
import { playSongReducedState } from "../reducers/playSongReducer";
interface Props {
  playerState: playSongReducedState;
  playSong: typeof playSong;
}

function Player({ playerState, playSong }: Props): ReactElement {
  console.log({ playerState });

  return (
    <Flex
      position="fixed"
      bottom="0"
      w="100%"
      alignSelf="center"
      mt="auto"
      height="10vh"
      justifyContent="center"
      alignItems="center"
    >
      <IoIosSkipBackward fontSize="6rem" />
      {playerState.play ? (
        <BsPause
          onClick={() => {
            playSong(TOGGLE_PLAY_STATE);
          }}
          fontSize="6rem"
        />
      ) : (
        <BsPlay
          onClick={() => {
            playSong(TOGGLE_PLAY_STATE);
          }}
          fontSize="6rem"
        />
      )}
      <IoIosSkipBackward transform="scale(-1)" fontSize="6rem" />
    </Flex>
  );
}
const mapDispatchToProps = {
  playSong,
};

const mapStateToProps = (state: AppState) => ({
  playerState: state.playerState,
});
export default connect(mapStateToProps, mapDispatchToProps)(Player);
