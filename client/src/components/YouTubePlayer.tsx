import React, { ReactElement, useEffect, useRef, useState } from "react";

interface Props {
  videoId?: string;
  play?: () => void;
  pause?: () => void;
  mute?: () => void;
  setVolume?: () => void;
}

export default function YouTubePlayer({ videoId }: Props): ReactElement {
  const [done, setdone] = useState(false);
  const ytPlayer: any = useRef();

  useEffect(() => {
    ytPlayer.current = new window.YT.Player("player", {
      height: "390",
      width: "640",
      videoId: "M7lc1UVf-VE",
      events: {
        onReady: (event: any) => {
          ("");
        },
        // event.target.playVideo(),
        onStateChange: (event: any) => {
          console.log("changed");
          //possible complications with Done state
          // if (event.data == window.YT.PlayerState.PLAYING && !done) {
          //   setTimeout(ytPlayer.current.stopVideo(), 6000);
          //   setdone(true);
          // }
        },
      },
    });
    console.log({ YT: ytPlayer.current });
  }, []);

  return (
    <div>
      <div id="player">Test</div>
    </div>
  );
}
