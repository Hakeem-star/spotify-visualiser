import { Flex, CheckboxGroup, Checkbox } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { useDispatch } from "react-redux";
import { updateSongSources } from "../actions";
import { updateSongSourcesType } from "../types";

export default function SourceSelector({}): ReactElement {
  const dispatch = useDispatch();

  return (
    <Flex height="100%" w="10%" background="red">
      <CheckboxGroup
        onChange={(values: updateSongSourcesType) => {
          dispatch(updateSongSources(values));
        }}
        mt="50px"
        defaultValue={["YOUTUBE"]}
      >
        <Checkbox value="SPOTIFY">Spotify</Checkbox>
        <Checkbox value="YOUTUBE">Youtube</Checkbox>
      </CheckboxGroup>
    </Flex>
  );
}
