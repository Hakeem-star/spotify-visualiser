import React, {
  forwardRef,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
/* eslint-disable */
// @ts-ignore
import AudioMotionAnalyzer from "audiomotion-analyzer";
/* eslint-enable */

interface Props {
  visualiserOn: boolean;
  container: {
    current: HTMLDivElement;
  };
}

export const Visualiser = ({
  visualiserOn,
  container,
}: Props): ReactElement => {
  const audioMotionRef = useRef<undefined | any>();

  useEffect(() => {
    let isSubscribed = true;
    // const audioCtx = new AudioContext();

    async function plugMediaToVisual() {
      const mediaDevices = window.navigator.mediaDevices as any;
      const stream = await mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      if (stream.getAudioTracks().length > 0) {
        // if (isSubscribed) {
        // setAudioSource(source);

        audioMotionRef.current = new AudioMotionAnalyzer(
          document.getElementById("visualiser"),
          { maxDecibels: -25, maxFreq: 22000, minDecibels: -85, minFreq: 20 }
        );
        const parent = container.current;
        const parentWidth = parent.offsetWidth;
        const parentHeight = parent.offsetHeight;

        audioMotionRef.current.setOptions({
          mode: 3,
          showLeds: true,
          showScaleY: true,
          barSpace: 0.5,
          width: parentWidth,
          height: parentHeight,
        });

        const audioCtx = audioMotionRef.current.audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        // this._analyzer.connect( this._audioCtx.destination );
        //IMPORTANT - FOR THIS TO WORK, WE NEED TO REMOVE LINE 91 IN THE audioMotion-analyuzer.js file
        //else we will create a feedback loop
        source.connect(audioMotionRef.current.analyzer);
        audioMotionRef.current.analyzer.disconnect(
          audioMotionRef.current.audioCtx.destination
        );

        // source.connect(audioMotionRef.current.analyzer);
      }
    }
    if (visualiserOn) {
      console.log({ container });
      plugMediaToVisual();
    } else {
      //Need to find a way to turn it off, rather than creating another instance
    }

    return () => {
      isSubscribed = false;
    };
  }, [visualiserOn]);

  return (
    <div
      id="visualiser"
      style={{
        // background: "red",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
      }}
    ></div>
  );
};
