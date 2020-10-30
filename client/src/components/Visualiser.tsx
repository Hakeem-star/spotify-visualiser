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
    <div></div>
    // <QuickStartCanvas
    //   onAction={(type: any, px: any, py: any, space: any) => {
    //     if (
    //       type === "up" &&
    //       Geom.withinBound(
    //         [px, py],
    //         space.center.$subtract(25),
    //         space.center.$add(25)
    //       )
    //     ) {
    //       if (!state || !state.playing) {
    //         const so = Sound.from(audioSource, audioSource.context);

    //         setstate(so.analyze(bins).start());

    //         if (!so) console.error(so);
    //       }
    //     }
    //   }}
    //   onAnimate={(time: any, ftime: any, space: any, form: any) => {
    //     if (state && state.playable) {
    //       // map time domain data to lines drawing two half circles
    //       const tdata = state
    //         .timeDomainTo([Const.two_pi, 1])
    //         .map((t: any, i: any) => {
    //           const ln = Line.fromAngle(
    //             [i > bins / 2 ? space.size.x : 0, space.center.y],
    //             t.x - Const.half_pi,
    //             space.size.y / 0.9
    //           );
    //           return [ln.p1, ln.interpolate(t.y)];
    //         });

    //       for (let i = 0, len = tdata.length; i < len; i++) {
    //         const c = Math.floor(Num.cycle(i / tdata.length) * 200);
    //         form.stroke(`rgba( ${255 - c}, 20, ${c}, .7 )`, 1).line(tdata[i]);
    //       }
    //     }
    //   }}
    // />
  );
};
