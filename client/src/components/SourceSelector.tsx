import {
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSongSources } from "../actions";
import { SPOTIFY, YOUTUBE } from "../actions/types";
import { AppState } from "../reducers";
interface Props {
  connectToSpotifyModalToggle: { open: () => void; close: () => void };
}
export default function SourceSelector({
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
    <Flex height="100%" align="center" ml="20px">
      <Menu closeOnSelect={false}>
        <MenuButton as={Button}>Sources</MenuButton>
        <MenuList minWidth="240px">
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
        </MenuList>
      </Menu>
    </Flex>
  );
}
