import React, { useEffect, useRef, useState } from "react";
/* eslint-disable */
// @ts-ignore
import AudioMotionAnalyzer from "audiomotion-analyzer";
/* eslint-enable */

export const Visualiser = () => {
  const [audioSource, setAudioSource]: any = useState(null);
  const audioMotionRef = useRef<undefined | any>();

  useEffect(() => {
    let isSubscribed = true;
    console.log("PINRT");
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

        audioMotionRef.current.setOptions({
          mode: 3,
          showLeds: true,
          showScaleY: true,
          barSpace: 0.5,
          width: 640,
          height: 270,
        });

        const audioCtx = audioMotionRef.current.audioCtx;

        const source = audioCtx.createMediaStreamSource(stream);
        // this._analyzer.connect( this._audioCtx.destination );
        //IMPORTANT - FOR THIS TO WORK, WE NEED TO REMOVE LINE 91 IN THE audioMotion-analyuzer.js file
        //else we will create a feedback loop
        source.connect(audioMotionRef.current.analyzer);
        // source.connect(audioMotionRef.current.analyzer);
      }
    }
    if (audioSource) {
      plugMediaToVisual();
    }
    return () => {
      isSubscribed = false;
    };
  }, [audioSource]);

  return (
    <div
      onClick={() => {
        console.log("AAA");
        setAudioSource(true);
      }}
      id="visualiser"
      style={{
        background: "red",
        position: "absolute",
        top: 0,
        right: 0,
        width: "500px",
        height: "800px",
      }}
    ></div>
  );
};
