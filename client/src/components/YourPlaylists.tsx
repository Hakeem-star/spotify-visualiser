import { Button, Flex, Grid } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setCreatePlaylistSidebar } from "../actions/createPlaylistSidebarActions";
import { editPlaylist, deletePlaylist } from "../actions/playlistActions";
import { AppState } from "../reducers";

export default function YourPlaylists(): ReactElement {
  const playlistsState = useSelector((state: AppState) => state.playlists);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log({ playlistsState });
  }, [playlistsState]);
  return (
    <Flex border="1px solid red" w="100%" h="100%">
      {Object.entries(playlistsState).map(([id, data]) => {
        const previewCount =
          //To prevent getting 3 images in the preview
          data.items.length > 2 && data.items.length === 3 ? 2 : 4;
        return (
          <div key={data.name}>
            {data.name}
            {/* generate image based on first 4 songs in items */}
            <Grid
              onClick={() => {
                history.push(`/playlists/${id}`);
              }}
              gridTemplateColumns="auto auto"
              gridTemplateRows="auto auto"
              w="200px"
              h="200px"
            >
              {data.items.slice(0, previewCount).map((val, index) => {
                return (
                  <img key={val.imageUrl} src={val.imageUrl} alt={val.name} />
                );
              })}
            </Grid>
            <Button
              onClick={() => {
                history.push("/");
                dispatch(setCreatePlaylistSidebar(true));
                dispatch(editPlaylist(id));
              }}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                dispatch(deletePlaylist(id));
              }}
            >
              Delete
            </Button>
          </div>
        );
      })}
    </Flex>
  );
}
