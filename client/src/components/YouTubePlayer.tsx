import React, { ReactElement, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { YOUTUBE } from "../actions/types";
import { AppState } from "../reducers";

interface Props {
  play?: () => void;
  pause?: () => void;
  mute?: () => void;
  setVolume?: () => void;
  playerState: { playing: boolean; source: string; url: string };
}

function YouTubePlayer({ playerState }: Props): ReactElement {
  const ytPlayer: any = useRef();
  const previousVidId = useRef("");

  useEffect(() => {
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
    console.log({ YT: ytPlayer.current });
  }, []);

  useEffect(() => {
    if (playerState.source === YOUTUBE) {
      if (playerState.url) ytPlayer.current.loadVideoById(playerState.url);
    } else {
      //If we are not playing a Youtube video, stop the Youtube video
      try {
        ytPlayer.current.stopVideo();
      } catch (error) {
        console.log(error);
      }
    }
  }, [playerState.url, playerState.source]);

  useEffect(() => {
    if (playerState.source === YOUTUBE) {
      if (playerState.url && previousVidId.current === playerState.url)
        if (playerState.playing) {
          //If we have a video url and we have clicked on the same video, pause the video
          //Play and stop Youtube video
          ytPlayer.current.playVideo();
        } else {
          ytPlayer.current.pauseVideo();
        }
    } else {
      //If we are not playing a Youtube video, stop the Youtube video
      try {
        ytPlayer.current.stopVideo();
      } catch (error) {
        console.log(error);
      }
    }
  }, [playerState]);

  previousVidId.current = playerState.url;

  return (
    // Hide the youtube video
    <div style={{ display: "none" }}>
      <div id="player">Test</div>
    </div>
  );
}

const mapStateToProps = (state: AppState) => ({
  playerState: state.playerState,
});
export default connect(mapStateToProps)(YouTubePlayer);
