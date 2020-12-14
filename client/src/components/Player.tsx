/** @jsx jsx */
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { AppState } from "../reducers";
import { changePlayerState, nextSong, prevSong } from "../actions";

import { IoIosSkipBackward } from "react-icons/io";
import {
  Tooltip,
  Box,
  Flex,
  Grid,
  List,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  Text,
  Link as ChakLink,
} from "@chakra-ui/react";
import { BsPlay, BsPause } from "react-icons/bs";
import { TOGGLE_PLAY_STATE } from "../actions/types";
import { jsx, css } from "@emotion/react";
import { animate, motion, useMotionValue } from "framer-motion";
import { seekSongPosition } from "../actions/externalPlayerActions";
import { RiFullscreenLine } from "react-icons/ri";
import msToHMS from "../util/formatMsToHMS";
import { Link } from "react-router-dom";

const calculatePosition = (duration: number, position: number) => {
  //Handles a 0/0 incident
  if (!duration && !position) {
    return 0;
  }
  //Get percentage position in duration
  return (position / duration) * 100;
};

interface Props {
  setVisualiserFullscreen: Dispatch<SetStateAction<boolean>>;
  setVisualiserPrompt: Dispatch<SetStateAction<boolean>>;
  setToggleVisualiserOn: Dispatch<SetStateAction<boolean>>;
  toggleVisualiserOn: boolean;
}
export default function Player({
  setVisualiserFullscreen,
  setVisualiserPrompt,
  setToggleVisualiserOn,
  toggleVisualiserOn,
}: Props): ReactElement {
  const dispatch = useDispatch();
  const playerState = useSelector((state: AppState) => state.playerState);
  const songMeta = useSelector(
    (state: AppState) => state.externalPlayerSongMeta
  );

  const { context, index, playlistId } = playerState;
  const { duration, position } = songMeta;
  console.log({ playlistId });
  const [sliderPosition, setSliderPosition] = useState(
    calculatePosition(duration, position)
  );

  const sliderXPosition = useMotionValue(sliderPosition);

  // console.log({ context: { duration, position, sliderPosition } });
  const controls = useRef<{ stop: () => void }>();
  const [movingSlider, setMovingSlider] = useState(false);

  const [visualiserSwitch, setVisualiserSwitch] = useState(false);

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
        duration: (duration - position) / 1000,
        ease: "linear",
        onUpdate: (val) => {
          setSliderPosition(val);
        },
      });

      return () => {
        //stop animating slider when a change is detected
        controls.current?.stop();
      };
    }
  }, [duration, position, sliderXPosition]);

  useEffect(() => {
    //This confirms that the visualiser is actually enabled/disabled
    setVisualiserSwitch(toggleVisualiserOn);
  }, [toggleVisualiserOn]);

  return (
    <Flex direction="column" background="white">
      <Slider
        w="95%"
        m="0 auto"
        focusThumbOnChange={false}
        value={sliderPosition}
        onChange={(val) => {
          // If no duration is set, don't move the slider
          duration && setSliderPosition(val);
        }}
        onChangeStart={() => {
          //Stop current animation
          controls.current?.stop();
          setMovingSlider(true);
        }}
        onChangeEnd={(val) => {
          console.log({
            mms: msToHMS((sliderPosition / 100) * duration),
            calc: (sliderPosition / 100) * duration,
          });
          //Seeking. Need to update position on relevant external players.
          //Making this change should force a change in the player state, which should update the songMeta state with the duration and position
          if (movingSlider) {
            dispatch(seekSongPosition(((val / 100) * duration) / 1000));
            //Might need to wait for signal from player to say we can start animating slider

            sliderXPosition.set(val);
            //Not sure this is needed as onchange already does this
            // setSliderPosition(val);
            setMovingSlider(false);
          }
        }}
      >
        <SliderTrack bg="red.100">
          <SliderFilledTrack bg="tomato" />
        </SliderTrack>
        <Tooltip label={msToHMS((sliderPosition / 100) * duration)}>
          <SliderThumb boxSize={6}>
            <Box color="tomato" />
          </SliderThumb>
        </Tooltip>
      </Slider>

      <Grid
        templateColumns="1fr 1.3fr 1fr"
        p="0 30px"
        h="100%"
        alignItems="center"
      >
        {/* Current track info */}

        <Flex justifyContent="flex-end" overflow="hidden" fontSize="0.8rem">
          {context[index] ? (
            <React.Fragment>
              <Text height="100%" mr="1rem">
                Now Playing:
              </Text>
              <Flex
                direction="column"
                overflow="hidden"
                w="15rem"
                css={css`
                  p {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                `}
              >
                {/* If there is no playlistId, take us to a playlistDetail page to see just the song */}
                <ChakLink
                  as={Link}
                  to={`/playlists/${playlistId || "current"}`}
                  _hover={{ fontWeight: 700 }}
                >
                  <Tooltip label={context[index].name}>
                    <Text>{context[index].name}</Text>
                  </Tooltip>
                  <Tooltip label={context[index].artist}>
                    <Text>{context[index].artist}</Text>
                  </Tooltip>
                  <Text>{context[index].duration}</Text>
                </ChakLink>
              </Flex>
            </React.Fragment>
          ) : null}
        </Flex>

        <Flex
          className="player-actions"
          overflow="hidden"
          style={{ justifySelf: "center" }}
          width="30%"
          alignSelf="center"
          height="10vh"
          justifyContent="center"
          alignItems="center"
        >
          <IoIosSkipBackward
            css={css`
              height: 60%;
            `}
            cursor="pointer"
            onClick={() => {
              dispatch(prevSong());
            }}
            fontSize="6rem"
          />
          {playerState.play && playerState.url ? (
            <BsPause
              cursor="pointer"
              onClick={() => {
                dispatch(changePlayerState(TOGGLE_PLAY_STATE));
                controls.current?.stop();
              }}
              fontSize="15rem"
            />
          ) : (
            <BsPlay
              cursor="pointer"
              onClick={() => {
                dispatch(changePlayerState(TOGGLE_PLAY_STATE));
                //Pressing play changes the player states which forces the playhead to start animating again
              }}
              fontSize="15rem"
            />
          )}
          <IoIosSkipBackward
            cursor="pointer"
            onClick={() => {
              dispatch(nextSong());
            }}
            transform="scale(-1)"
            fontSize="6rem"
            css={css`
              height: 60%;
            `}
          />
        </Flex>

        {/* Next track info */}
        <Flex width="30%">
          <Box
            className="visualiser"
            width="100%"
            css={css`
              height: calc(100% + 3px);
              display: flex;
              align-self: flex-start;
              transition: border 0.3s ease;
              align-items: center;
              align-self: center;
              cursor: pointer;
            `}
            onClick={() => {
              //This is set to false in the visualiser component
              setVisualiserPrompt(true);
            }}
          >
            <Text mr="auto">Visualiser</Text>
            <Switch
              ml="10px"
              isChecked={visualiserSwitch}
              css={css`
                > span {
                  background: #a31709;
                }
              `}
              size="md"
              id="Visualiser"
            />
          </Box>
          <Box
            w={visualiserSwitch ? "60px" : "0px"}
            h="100%"
            ml="1rem"
            className="fullscreen"
          >
            {toggleVisualiserOn && (
              <Grid
                placeItems="center"
                height="100%"
                fontSize="1.5rem"
                cursor="pointer"
                onClick={() => {
                  setVisualiserFullscreen(true);
                }}
              >
                <RiFullscreenLine />
              </Grid>
            )}
          </Box>
        </Flex>
      </Grid>
    </Flex>
  );
}
