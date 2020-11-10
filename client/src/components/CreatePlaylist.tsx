import { Box, Button, Flex, Input } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { discardPlaylist } from "../actions/createPlaylistDragDropActions";
import { savePlaylist } from "../actions/savePlaylist";
import { AppState } from "../reducers";
import { MyTextInput } from "./Auth/ForkitTextInput";
import CreatedPlaylistMessage from "./CreatedPlaylistMessage";

export default function CreatePlaylist(): ReactElement {
  const createPlaylist = useSelector((state: AppState) => state.createPlaylist);
  const createPlaylistSidebarOpenState = useSelector(
    (state: AppState) => state.createPlaylistSidebar
  );
  const playlists = useSelector((state: AppState) => state.playlists);
  const dispatch = useDispatch();
  const [playListCreated, setplayListCreated] = useState(false);

  useEffect(() => {
    //make sure this is false when component is mounted in case it was enabled somewhere else
    setplayListCreated(false);
  }, []);

  useEffect(() => {
    Object.keys(playlists).length && setplayListCreated(true);
  }, [playlists]);

  console.log({ createPlaylist });
  return (
    <Box
      w={createPlaylistSidebarOpenState ? "20%" : "0"}
      h="100%"
      // transform="scaleX()"
      transition="width 1s"
    >
      Create Playlist
      {/* Add more validation */}
      {playListCreated ? (
        <CreatedPlaylistMessage setplayListCreated={setplayListCreated} />
      ) : (
        <Formik
          initialValues={{ name: "" }}
          validate={(values) => {
            const errors: {
              name?: string;
            } = {};

            if (!values.name) {
              errors.name = "Required";
            } else if (values.name.length < 5) {
              errors.name = "Must be at least 5 characters";
            } else if (
              Object.entries(playlists).some(
                ([id, data]) => data.name === values.name
              )
            ) {
              errors.name = "Playlist by that name already exists";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            dispatch(savePlaylist(values.name));
          }}
        >
          {({ isSubmitting }) => (
            <Form style={{ width: "100%", height: "100%" }}>
              <MyTextInput
                placeholder="New Playlist"
                label="name"
                name="name"
                type="text"
              />
              <Droppable droppableId={"createPlaylist"}>
                {(provided) => (
                  <Box
                    h="80%"
                    w="100%"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {createPlaylist.map(
                      ({ name, artist, year, url, imageUrl }, index) => {
                        return (
                          <Draggable
                            draggableId={"playlist" + url}
                            index={index}
                            key={index + imageUrl}
                          >
                            {(provided) => (
                              <div
                                key={url}
                                {...provided.dragHandleProps}
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                              >
                                <p>{name}</p>
                                <p>{artist}</p>
                                <p>{year}</p>
                              </div>
                            )}
                          </Draggable>
                        );
                      }
                    )}
                  </Box>
                )}
              </Droppable>
              {/* confirm creation and provide option to create another */}
              <Button type="submit" isDisabled={isSubmitting}>
                Save Playlist
              </Button>
              <Button
                variantColor="red"
                onClick={() => dispatch(discardPlaylist())}
              >
                Discard Playlist
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Box>
  );
}
