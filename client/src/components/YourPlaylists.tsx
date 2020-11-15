import { Flex, Grid } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { AppState } from "../reducers";

export default function YourPlaylists(): ReactElement {
  const playlistsState = useSelector((state: AppState) => state.playlists);
  const history = useHistory();
  return (
    <Flex border="1px solid red" w="100%" h="100%">
      {Object.entries(playlistsState).map(([id, data]) => {
        const previewCount =
          //To prevent getting 3 images in the preview
          data.items.length > 2 && data.items.length === 3 ? 2 : 4;
        return (
          <div
            onClick={() => {
              history.push(`/playlists/${id}`);
            }}
            key={data.name}
          >
            {data.name}
            {/* generate image based on first 4 songs in items */}
            <Grid
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
          </div>
        );
      })}
    </Flex>
  );
}
