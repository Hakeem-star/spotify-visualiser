import { MenuOptionGroup, MenuItemOption } from "@chakra-ui/react";
import React, { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSongSources } from "../actions";
import { SPOTIFY, YOUTUBE } from "../actions/types";
import { AppState } from "../reducers";

interface Props {
  connectToSpotifyModalToggle: { open: () => void; close: () => void };
}

export default function SourceSelectorOptions({
  connectToSpotifyModalToggle,
}: Props): ReactElement {
  const dispatch = useDispatch();
  const spotifyAuth = useSelector((state: AppState) => state.spotifyAuth);
  const songSources = useSelector((state: AppState) => state.songSources);

  console.log({ isSignedIn: spotifyAuth.isSignedIn }, songSources);

  useEffect(() => {
    //Check the box when we confirm signin for Spotify
    if (spotifyAuth.isSignedIn) {
      if (!songSources.includes(SPOTIFY)) {
        const newState = [SPOTIFY, YOUTUBE];
        dispatch(updateSongSources(newState));
      }
    }
  }, [spotifyAuth.isSignedIn]);

  return (
    <MenuOptionGroup
      defaultValue={songSources}
      value={songSources}
      onChange={(values: any) => {
        console.log("LOGGIN", values.includes(SPOTIFY), !spotifyAuth);
        if (values.includes(SPOTIFY) && !spotifyAuth.isSignedIn) {
          //show sign in modal
          connectToSpotifyModalToggle.open();
          return;
        }
        dispatch(updateSongSources(values));
      }}
      type="checkbox"
    >
      <MenuItemOption value={SPOTIFY}>Spotify</MenuItemOption>
      <MenuItemOption value={YOUTUBE}>Youtube</MenuItemOption>
    </MenuOptionGroup>
  );
}
