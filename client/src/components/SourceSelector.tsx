import {
  Flex,
  CheckboxGroup,
  Checkbox,
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
import { updateSongSourcesType } from "../types";
interface Props {
  connectToSpotifyModalToggle: { open: () => void; close: () => void };
}
export default function SourceSelector({
  connectToSpotifyModalToggle,
}: Props): ReactElement {
  const dispatch = useDispatch();
  const spotifyAuth = useSelector((state: AppState) => state.spotifyAuth);
  // const [checkboxState
  const [checkboxStates, setCheckboxStates] = useState<string[]>([YOUTUBE]);

  useEffect(() => {
    //Check the box when we confirm signin for Spotify
    if (spotifyAuth.isSignedIn) {
      setCheckboxStates((state) => {
        if (!state.includes(SPOTIFY)) {
          const newState = [SPOTIFY, YOUTUBE];
          dispatch(updateSongSources(newState));
          return newState;
        } else return state;
      });
    }
  }, [spotifyAuth.isSignedIn]);

  return (
    <Flex height="100%" align="center" ml="20px">
      <Menu closeOnSelect={false}>
        <MenuButton as={Button}>Sources</MenuButton>
        <MenuList minWidth="240px">
          <MenuOptionGroup
            defaultValue={checkboxStates}
            onChange={(values: any) => {
              console.log(values.includes(SPOTIFY), !spotifyAuth);
              if (values.includes(SPOTIFY) && !spotifyAuth.isSignedIn) {
                //show sign in modal
                connectToSpotifyModalToggle.open();
                return;
              }
              console.log({ values });
              setCheckboxStates(values);
              dispatch(updateSongSources(values));
            }}
            type="checkbox"
          >
            <MenuItemOption value={SPOTIFY}>Spotify</MenuItemOption>
            <MenuItemOption value={YOUTUBE}>Youtube</MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>

      {/* <CheckboxGroup
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          width: 100%;
        `}
        spacing="0px"
        onChange={(values: updateSongSourcesType) => {
          console.log(values.includes(SPOTIFY), !spotifyAuth);
          if (values.includes(SPOTIFY) && !spotifyAuth.isSignedIn) {
            //show sign in modal
            connectToSpotifyModalToggle.open();
            return;
          }
          console.log({ values });
          setCheckboxStates(values);
          dispatch(updateSongSources(values));
        }}
        value={checkboxStates}
        defaultValue={[YOUTUBE]}
      >
        <Checkbox value={SPOTIFY}>Spotify</Checkbox>
        <Checkbox value={YOUTUBE}>Youtube</Checkbox>
      </CheckboxGroup> */}
    </Flex>
  );
}
