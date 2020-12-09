/** @jsx jsx */

import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { discardPlaylist } from "../actions/createPlaylistDragDropActions";
import { savePlaylist } from "../actions/playlistActions";
import { AppState } from "../reducers";
import { MyTextInput } from "./Auth/ForkitTextInput";
import CreatedPlaylistMessage from "./CreatedPlaylistMessage";
import { RiFullscreenLine, RiPlayListAddLine } from "react-icons/ri";
import { jsx, css } from "@emotion/react";
import SearchResult from "./SearchResult";
import DraggableCreatePlaylistItem from "./DraggableCreatePlaylistItem";
import { insertIntoArray } from "../util/insertIntoArray";

export default function CreatePlaylist(): ReactElement {
  //This might not be needed but I may be able to refactor
  // const createPlaylistSidebarOpenState = useSelector(
  //   (state: AppState) => state.createPlaylistSidebar
  // );
  const createPlaylistState = useSelector(
    (state: AppState) => state.createPlaylist
  );
  //All playlists

  const playlists = useSelector((state: AppState) => state.playlists);
  const dispatch = useDispatch();
  const [playListCreated, setPlayListCreated] = useState(false);
  const [submittedCount, setSubmittedCount] = useState(0);

  const [nameInputValue, setNameInputValue] = useState("");

  useEffect(() => {
    //Makes sure this is false when component is mounted in case it was enabled somewhere else
    setPlayListCreated(false);
  }, []);

  useEffect(() => {
    console.log({ submittedCount });
    //Cleans out the playlist state on each mount
    if (submittedCount) {
      setPlayListCreated(true);
      //Reset playlist
      dispatch(discardPlaylist());
    }
    // }
  }, [submittedCount]);

  const buttonVariant = useBreakpointValue({ base: "xs", lg: "md", xl: "xs" });

  return (
    // Drag item here to create playlist
    <Flex
      borderLeft="1px solid #A31709"
      p="20px 20px"
      minW="300px"
      maxW="30%"
      h="100%"
    >
      <Flex w="100%" flexDirection="column">
        <Text fontSize="1.5rem" mb="20px">
          Create Playlist
        </Text>
        {/* Add more validation */}
        {playListCreated ? (
          <CreatedPlaylistMessage setplayListCreated={setPlayListCreated} />
        ) : (
          <Formik
            initialValues={{ name: createPlaylistState.name || "" }}
            validate={(values) => {
              const errors: {
                name?: string;
              } = {};

              if (!values.name) {
                errors.name = "A name is required";
              } else if (values.name.length < 5) {
                errors.name = "Must be at least 5 characters";
              } else if (
                //It's not tha same name as the playlist it's editing
                createPlaylistState.name !== values.name &&
                //Check is Playlist by that name already exists
                Object.entries(playlists).some(
                  ([id, data]) => data.name === values.name
                )
              ) {
                errors.name = "Playlist by that name already exists";
              } else if (!createPlaylistState.items.length) {
                errors.name = "Please add at least 1 song";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              console.log({
                nme: createPlaylistState.name,
                name,
                id: createPlaylistState.id,
              });
              console.log({ createPlaylistState: createPlaylistState.items });

              dispatch(
                savePlaylist(
                  //To rename, attempt to use the values in the form
                  values.name || createPlaylistState.name,
                  createPlaylistState.id
                )
              );
              setSubmittedCount(submittedCount + 1);
            }}
          >
            {({ isSubmitting, resetForm }) => (
              <Form
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <MyTextInput
                  placeholder="New Playlist"
                  label="Playlist Name"
                  name="name"
                  type="text"
                />
                <Droppable droppableId={"createPlaylist"}>
                  {(provided) => (
                    <Flex
                      mt="30px"
                      flex={1}
                      w="100%"
                      direction="column"
                      overflow="auto"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {insertIntoArray(
                        createPlaylistState.items.map((item, index) => {
                          const { name, artist, year, url, imageUrl } = item;
                          return (
                            <DraggableCreatePlaylistItem
                              context={createPlaylistState.items}
                              {...item}
                              index={index}
                              key={url + name}
                            />
                          );
                        }),
                        <Divider borderColor="#417AF0" m="3px 0" />
                      )}
                      <Box
                        flex={1}
                        flexBasis="95px"
                        flexShrink={0}
                        mt="auto"
                        pt="20px"
                        width="100%"
                        className="DropBox"
                      >
                        <Flex
                          direction="column"
                          alignItems="center"
                          justify="center"
                          border="2px dashed red"
                          p="10px 0"
                        >
                          <RiPlayListAddLine fontSize="2rem" />
                          <Text>Drop here to add</Text>
                        </Flex>
                      </Box>
                    </Flex>
                  )}
                </Droppable>
                {/* confirm creation and provide option to create another */}
                <Flex
                  direction="row"
                  m="30px 0 auto"
                  justify="space-between"
                  flexWrap="wrap"
                >
                  <Button
                    size={buttonVariant}
                    type="submit"
                    isDisabled={isSubmitting}
                  >
                    Save Playlist
                  </Button>
                  <Button
                    size={buttonVariant}
                    onClick={() => {
                      resetForm({ values: { name: "" } });
                      dispatch(discardPlaylist());
                    }}
                  >
                    Discard Playlist
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        )}
      </Flex>
    </Flex>
  );
}
