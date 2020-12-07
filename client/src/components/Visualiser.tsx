import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
/* eslint-disable */
// @ts-ignore
import AudioMotionAnalyzer from "audiomotion-analyzer";
/* eslint-enable */

interface Props {
  toggleVisualiserOn: boolean;
  visualiserPrompt: boolean;
  visualiserFullscreen: boolean;
  setToggleVisualiserOn: Dispatch<SetStateAction<boolean>>;
  setVisualiserPrompt: Dispatch<SetStateAction<boolean>>;
  setVisualiserFullscreen: Dispatch<SetStateAction<boolean>>;
  container: {
    current: HTMLDivElement;
  };
}

export const Visualiser = ({
  toggleVisualiserOn,
  visualiserFullscreen,
  setToggleVisualiserOn,
  setVisualiserPrompt,
  setVisualiserFullscreen,
  visualiserPrompt,
  container,
}: Props): ReactElement => {
  const audioMotionRef = useRef<undefined | any>();
  const sourceRef = useRef<any>();

  useEffect(() => {
    async function plugMediaToVisual() {
      try {
        const mediaDevices = window.navigator.mediaDevices as any;
        const stream = await mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        if (stream.getAudioTracks().length > 0) {
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

          sourceRef.current = audioCtx.createMediaStreamSource(stream);

          sourceRef.current.connect(audioMotionRef.current.analyzer);

          audioMotionRef.current.analyzer.disconnect(
            audioMotionRef.current.audioCtx.destination
          );
          setToggleVisualiserOn(true);
        }

        stream.getAudioTracks()[0].onended = () => {
          setToggleVisualiserOn(false);
          setVisualiserPrompt(false);
        };
      } catch (err) {
        console.log("error" + err);
        setVisualiserPrompt(false);
      }
    }
    console.log({ audioMotionRef: audioMotionRef.current });
    if (visualiserPrompt) {
      console.log({ container });
      plugMediaToVisual();
    } else {
      //Need to find a way to turn it off, rather than creating another instance
      audioMotionRef?.current?.analyzer?.disconnect();
      console.log({ current: audioMotionRef.current });
    }
  }, [visualiserPrompt, container]);

  useEffect(() => {
    //Toggle fullscreen
    visualiserFullscreen && audioMotionRef.current.toggleFullscreen();
    setVisualiserFullscreen(false);
  }, [visualiserFullscreen]);

  return (
    <div
      id="visualiser"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
        display: visualiserPrompt ? "block" : "none",
      }}
    ></div>
  );
};
