import React, { ReactElement, useEffect, useRef, useState } from "react";
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
import { animate, motion, useMotionValue } from "framer-motion";
import { seekSongPosition } from "../actions/externalPlayerActions";

const calculatePosition = (duration: number, position: number) => {
  //Handles a 0/0 incident
  if (!duration && !position) {
    return 0;
  }
  //Get percentage position in duration
  return (position / duration) * 100;
};

export default function Player(): ReactElement {
  const dispatch = useDispatch();
  const playerState = useSelector((state: AppState) => state.playerState);
  const songMeta = useSelector(
    (state: AppState) => state.externalPlayerSongMeta
  );

  const { context, index } = playerState;
  const { duration, position } = songMeta;

  const [sliderPosition, setSliderPosition] = useState(
    calculatePosition(duration, position)
  );

  const sliderXPosition = useMotionValue(sliderPosition);

  // console.log({ context: { duration, position, sliderPosition } });
  const controls = useRef<{ stop: () => void }>();
  const [movingSlider, setMovingSlider] = useState(false);

  const previousPlayerStateUrl = useRef();

  // useEffect(() => {
  //   setSliderPosition((state) => {
  //     return state;
  //   });
  // }, [movingSlider]);

  useEffect(() => {
    //Set the start time to 0 when a new song is played
    //If url changed, stop the animation and set it to 0, we then wait for duration & position to update in the next useEffect, to start the animation
    controls.current?.stop();
    sliderXPosition.set(0);
  }, [playerState.url, sliderXPosition]);

  useEffect(() => {
    //If a new track is playing, get the position of the track and match it to the slider position
    //Play song from postion & duration

    if (duration) {
      controls.current = animate(sliderXPosition, 100, {
        type: "tween",
        duration: duration - position,
        ease: "linear",
        onUpdate: (val) => {
          console.log({
            val,
            duration,
            position,
          });
          setSliderPosition(val);
        },
      });

      return () => {
        //stop animating slider when a change is detected
        controls.current?.stop();
      };
    }
  }, [duration, position, sliderXPosition]);

  return (
    <Flex direction="column">
      <Slider
        w="95%"
        m="0 auto"
        focusThumbOnChange={false}
        value={sliderPosition}
        onChange={(val) => {
          setSliderPosition(val);
        }}
        onChangeStart={() => {
          controls.current?.stop();
          setMovingSlider(true);
        }}
        onChangeEnd={(val) => {
          //Seeking. Need to update position on relevant external players.
          //Making this change should force a change in the player state, which should update the songMeta state with the duration and position

          if (movingSlider) {
            dispatch(seekSongPosition((val / 100) * duration));
            //Might need to wait for signal from player to say we can start animating slider

            sliderXPosition.set(val);
            setSliderPosition(val);
            setMovingSlider(false);
          }
        }}
      >
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
                controls.current?.stop();
              }}
              fontSize="6rem"
            />
          ) : (
            <BsPlay
              onClick={() => {
                dispatch(changePlayerState(TOGGLE_PLAY_STATE));
                //Pressing play changes the player states which forces the playhead to start animating again
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
