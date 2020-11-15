import { Flex, CheckboxGroup, Checkbox } from "@chakra-ui/core";
import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateSongSources } from "../actions";
import { SPOTIFY, YOUTUBE } from "../actions/types";
import { AppState } from "../reducers";
import { updateSongSourcesType } from "../types";

export default function SourceSelector({}): ReactElement {
  const dispatch = useDispatch();
  const spotifyAuth = useSelector((state: AppState) => state.spotifyAuth);
  // const [checkboxState
  const [checkboxStates, setCheckboxStates] = useState<
    (string | number | undefined)[]
  >([YOUTUBE]);

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
    <Flex height="100%" w="10%" background="red">
      <CheckboxGroup
        onChange={(values: updateSongSourcesType) => {
          console.log({ values });
          setCheckboxStates(values);
          dispatch(updateSongSources(values));
        }}
        value={checkboxStates}
        mt="50px"
        defaultValue={[YOUTUBE]}
      >
        <Checkbox value={SPOTIFY}>Spotify</Checkbox>
        <Checkbox value={YOUTUBE}>Youtube</Checkbox>
      </CheckboxGroup>
    </Flex>
  );
}
