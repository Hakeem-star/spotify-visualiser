import { Button, Flex, Text } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { useDispatch } from "react-redux";
import { discardPlaylist } from "../actions/createPlaylistDragDropActions";

export default function CreatedPlaylistMessage({
  setplayListCreated,
}: {
  setplayListCreated: React.Dispatch<React.SetStateAction<boolean>>;
}): ReactElement {
  const dispatch = useDispatch();
  return (
    <Flex w="100%" h="100%">
      {console.log("MOOOO")}
      <Text>Playlist was created succesfully</Text>
      <Button
        onClick={() => {
          dispatch(discardPlaylist());
          setplayListCreated(false);
        }}
      >
        Make another?
      </Button>
    </Flex>
  );
}
