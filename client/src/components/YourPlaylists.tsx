import { Text, Image, Button, Flex, Grid, SimpleGrid } from "@chakra-ui/react";
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
    <SimpleGrid
      autoColumns="minmax(200px,15%)"
      autoRows="minmax(300px,30%)"
      justifyItems="center"
      alignItems="center"
      autoFlow="column"
      border="1px solid red"
      w="100%"
      h="100%"
    >
      {Object.entries(playlistsState).map(([id, data]) => {
        const previewCount =
          //To prevent getting 3 images in the preview
          data.items.length > 2 && data.items.length === 3 ? 2 : 4;
        return (
          <Grid
            className="playlist__border"
            key={data.name}
            width="100%"
            height="100%"
            border="1px solid #dfdfdf"
            placeItems="center"
          >
            <Grid
              cursor="pointer"
              className="playlist__items-container"
              placeItems="center"
              width="80%"
              height="90%"
              border="1px solid #ffefeb"
              borderRadius="10px"
              boxShadow="2px 3px 3px 0px #f3b8ac82"
            >
              <Text padding="7px 0">{data.name}</Text>
              {/* generate image based on first 4 songs in items */}
              <Grid
                onClick={() => {
                  history.push(`/playlists/${id}`);
                }}
                // templateColumns="repeat(auto-fit, minmax(50%, 1fr))"
                w="200px"
                h="200px"
                borderRadius="5px"
                boxShadow="inset 1px 1px 13px 0px black"
                overflow="hidden"
                border="1px solid #dfdfdf"
              >
                {data.items.slice(0, previewCount).map((val, index) => {
                  console.log({ images: val.imageUrl });
                  return (
                    <Image
                      zIndex="-1"
                      // max-width="100%"
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      key={val.imageUrl[0].url}
                      src={val.imageUrl[0].url}
                      alt={val.name}
                    />
                  );
                })}
              </Grid>
              <Flex
                transform="translateY(-50%);"
                width="100%;"
                justifyContent="space-evenly;"
                padding="0 15%;"
              >
                <Button
                  onClick={() => {
                    //Return to homepage, so searches can be done
                    history.push("/");
                    // dispatch(setCreatePlaylistSidebar(true));
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
              </Flex>
            </Grid>
          </Grid>
        );
      })}
    </SimpleGrid>
  );
}
