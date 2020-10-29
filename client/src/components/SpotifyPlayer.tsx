import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { AppState } from "../reducers";

interface Props {
  play?: () => void;
  pause?: () => void;
  mute?: () => void;
  setVolume?: () => void;
  playerState: { playing: boolean; source: string; url: string };
}

function SpotifyPlayer({}: Props): ReactElement {
  return <></>;
}

const mapStateToProps = (state: AppState) => ({
  playerState: state.playerState,
});
export default connect(mapStateToProps)(SpotifyPlayer);
