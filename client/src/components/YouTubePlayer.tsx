import React, { ReactElement, useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { nextSong, playSong } from "../actions";
import { setCurrentSongDetails } from "../actions/externalPlayerActions";
import { NEXT_SONG, YOUTUBE } from "../actions/types";
import { AppState } from "../reducers";
import { playSongReducedState } from "../reducers/playSongReducer";

interface Props {
  play?: () => void;
  pause?: () => void;
  mute?: () => void;
  setVolume?: () => void;
}

export default function YouTubePlayer(): ReactElement {
  const ytPlayer: any = useRef();
  const previousVidId = useRef("");
  const dispatch = useDispatch();
  const playerState = useSelector((state: AppState) => state.playerState);
  const externalPlayerSongMeta = useSelector(
    (state: AppState) => state.externalPlayerSongMeta
  );
  const signedIn = useSelector((state: AppState) => state.auth.isSignedIn);

  useEffect(() => {
    //Setup player
    ytPlayer.current = new window.YT.Player("player", {
      height: "390",
      width: "640",
      events: {
        onReady: (event: any) => {
          console.log("yt ready");
        },
        // event.target.playVideo(),
        onStateChange: (event: any) => {
          console.log("changed");
        },
      },
    });

    //Add event listener
    ytPlayer.current.addEventListener("onStateChange", (event: any) => {
      console.log({ event });

      if ([1].some((val) => val == event.data)) {
        //If playing, paused or buffering, get the current time and duration
        //Duration and position are in seconds, not ms
        const duration = ytPlayer.current.getDuration() * 1000;
        const position = ytPlayer.current.getCurrentTime() * 1000;
        console.log({ duration, position });
        dispatch(setCurrentSongDetails({ duration, position }));
      }
      if (event.data === 0) {
        console.log("ENDED");
        dispatch(nextSong());
      }
    });
  }, []);

  useEffect(() => {
    //When the URL or the source changes
    if (playerState.source === YOUTUBE) {
      console.log({ playerState: playerState.url });
      if (playerState.url) ytPlayer.current.loadVideoById(playerState.url);
    } else {
      //If we are not playing a Youtube video, stop the Youtube video
      try {
        ytPlayer?.current?.stopVideo();
      } catch (error) {
        console.log(error);
      }
    }
  }, [playerState.url, playerState.source]);

  useEffect(() => {
    if (playerState.source === YOUTUBE) {
      console.log("URL", previousVidId.current, playerState.url);

      if (previousVidId.current === playerState?.url)
        if (playerState.play) {
          //If we have a video url and we have clicked on the same video, pause the video
          //Play and stop Youtube video

          ytPlayer.current.playVideo();
        } else {
          ytPlayer.current.pauseVideo();
        }
    } else {
      //If we are not playing a Youtube video, stop the Youtube video
      try {
        ytPlayer?.current?.stopVideo();
      } catch (error) {
        console.log(error);
      }
    }
    previousVidId.current = playerState.url;
  }, [playerState]);

  useEffect(() => {
    //Seeking
    if (playerState.source === YOUTUBE) {
      console.log({ seekPosition: externalPlayerSongMeta.seekPosition });
      ytPlayer.current.seekTo(externalPlayerSongMeta.seekPosition, true);
    }
  }, [externalPlayerSongMeta.seekPosition]);

  //If signIn status changes
  useEffect(() => {
    //Stop when signed out
    if (!signedIn && ytPlayer.current) {
      try {
        ytPlayer.current.stopVideo();
      } catch (error) {
        console.log(error);
      }
    }
  }, [signedIn]);

  return (
    // Hide the youtube video
    <div style={{ display: "none" }}>
      <div id="player"></div>
    </div>
  );
}
