import { Const, Geom, Line, Num, Sound } from "pts";
import React, { useEffect, useState } from "react";
import { QuickStartCanvas } from "react-pts-canvas";

const bins = 128;
declare global {
  interface Window {
    isAudioPlaying: () => boolean;
  }
}
export const Visualiser = () => {
  const [state, setstate]: any = useState(null);
  const [audioSource, setAudioSource]: any = useState(null);

  useEffect(() => {
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();

    const bufferLength = analyser.fftSize;
    const dataArray = new Float32Array(bufferLength);

    window.isAudioPlaying = () => {
      analyser.getFloatTimeDomainData(dataArray);
      for (let i = 0; i < bufferLength; i++) {
        if (dataArray[i] != 0) return true;
      }
      return false;
    };
    let isSubscribed = true;

    async function plugMediaToVisual() {
      const mediaDevices = window.navigator.mediaDevices as any;
      const stream = await mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      console.log({ stream });
      if (stream.getAudioTracks().length > 0) {
        if (isSubscribed) {
          const source = audioCtx.createMediaStreamSource(stream);
          //   source.connect(analyser);
          setAudioSource(source);
          console.log(source);
        }

        // Pts.quickStart("#pt", "#e2e6ef");
      }
    }
    plugMediaToVisual();
    return () => {
      isSubscribed = false;
    };
  }, []);

  return (
    <div style={{ position: "absolute", top: 0, right: 0 }}>
      <QuickStartCanvas
        onAnimate={(space: any, form: any, time: any) =>
          form.point(space.pointer, 10)
        }
      />
    </div>
  );
};
