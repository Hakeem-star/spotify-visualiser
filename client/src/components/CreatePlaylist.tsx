import { Box, Button } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { AppState } from "../reducers";

export default function CreatePlaylist(): ReactElement {
  const createPlaylist = useSelector((state: AppState) => state.createPlaylist);
  const createPlaylistSidebarOpenState = useSelector(
    (state: AppState) => state.createPlaylistSidebar
  );
  console.log({ createPlaylist });
  return (
    <Box
      w={createPlaylistSidebarOpenState ? "20%" : "0"}
      h="100%"
      // transform="scaleX()"
      transition="width 1s"
    >
      Create Playlist
      <Droppable droppableId={"createPlaylist"}>
        {(provided) => (
          <Box w="100%" ref={provided.innerRef} {...provided.droppableProps}>
            {createPlaylist.map(({ name, artist, year, url }) => {
              return (
                <div key={url}>
                  <p>{name}</p>
                  <p>{artist}</p>
                  <p>{year}</p>
                </div>
              );
            })}
          </Box>
        )}
      </Droppable>
      <Button>Save Playlist</Button>
      <Button>Discard Playlist</Button>
    </Box>
  );
}
