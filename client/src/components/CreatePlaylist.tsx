/** @jsx jsx */

import {
  Box,
  Button,
  Divider,
  Flex,
  Text,
  useBreakpointValue,
  CloseButton,
  chakra,
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

import { motion, useAnimation } from "framer-motion";
import { toggleCreatePlaylistSidebar } from "../actions/createPlaylistSidebarActions";
import { use } from "chai";
import { useHistory } from "react-router-dom";
const MotionDiv = chakra(motion.div);

// const MotionFlex = motion.custom(Flex);
// const MotionBox = motion.custom(Box);

const toggleSidebar = {
  visible: {
    minWidth: "300px",
    padding: "20px",
    transition: { type: "tween" },
  },
  hidden: {
    minWidth: "0px",
    padding: "0px",
    transition: { delay: 0.2, type: "tween" },
  },
};

const toggleInnerSidebar = {
  visible: {
    display: "flex",
    opacity: 1,
    transition: { delay: 0.2 },
  },
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
    transitionEnd: {
      display: "none",
    },
  },
};

const toggleHandleSidebar = {
  visible: {
    display: "block",
    opacity: 1,
  },
  hidden: {
    opacity: 0,
    transitionEnd: {
      display: "none",
    },
  },
};

export default function CreatePlaylist(): ReactElement {
  //This might not be needed but I may be able to refactor
  // const createPlaylistSidebarOpenState = useSelector(
  //   (state: AppState) => state.createPlaylistSidebar
  // );
  const history = useHistory();
  const createPlaylistState = useSelector(
    (state: AppState) => state.createPlaylist
  );
  //All playlists

  const playlists = useSelector((state: AppState) => state.playlists);
  const createPlaylistSidebarState = useSelector(
    (state: AppState) => state.createPlaylistSidebar
  );
  const dispatch = useDispatch();
  const [playListCreated, setPlayListCreated] = useState(false);
  const [submittedCount, setSubmittedCount] = useState(0);
  const mountedRecord = useRef(0);

  useEffect(() => {
    mountedRecord.current = 0;
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
  const sidebarContainerControls = useAnimation();
  const sidebarInnerControls = useAnimation();
  const sidebarHandleControls = useAnimation();

  useEffect(() => {
    console.log({
      createPlaylistSidebarState,
      history,
      mountedRecord: mountedRecord.current,
    });
    //If the animation is happening on mount, just set the values
    if (!mountedRecord.current) {
      if (createPlaylistSidebarState) {
        sidebarContainerControls.set(toggleSidebar.visible);
        sidebarInnerControls.set(toggleInnerSidebar.visible);
        sidebarHandleControls.set(toggleHandleSidebar.hidden);
      } else {
        sidebarInnerControls.set(toggleInnerSidebar.hidden);
        sidebarContainerControls.set(toggleSidebar.hidden);
        sidebarHandleControls.set(toggleHandleSidebar.visible);
      }
    } else if (createPlaylistSidebarState) {
      //If the animation is not happening on mount, Animate!
      sidebarContainerControls.start(toggleSidebar.visible);
      sidebarInnerControls.start(toggleInnerSidebar.visible);
      sidebarHandleControls.start(toggleHandleSidebar.hidden);
    } else {
      sidebarInnerControls.start(toggleInnerSidebar.hidden);
      sidebarContainerControls.start(toggleSidebar.hidden).then(() => {
        sidebarHandleControls.start(toggleHandleSidebar.visible);
        //Dispatch close event in case this was triggered by mounted true state
        //When this happens, the toggle remains closed and doesn't open because the handle dispatches a value of true
        //Which would not cause a change in state meaning this useEffect will not trigger
        console.log({
          createPlaylistSidebarStateDOING: createPlaylistSidebarState,
        });
        // dispatch(toggleCreatePlaylistSidebar(false));
      });
    }
  }, [createPlaylistSidebarState]);

  useEffect(() => {
    mountedRecord.current = 1;
  }, []);

  return (
    // Drag item here to create playlist
    <MotionDiv
      display="flex"
      borderLeft="1px solid #A31709"
      maxW="30%"
      h="100%"
      position="relative"
      // css={css`
      //   transform: translateX(${!createPlaylistSidebarState ? "100%" : "0%"});
      //   transition: transform 1s;
      // `}
      animate={sidebarContainerControls}
    >
      <MotionDiv
        position="absolute"
        top="40%"
        left="0"
        transform="translateX(-100%)"
        background="white"
        border="1px solid grey"
        cursor="pointer"
        zIndex="1"
        padding="0.4rem"
        borderTopLeftRadius="0.3rem;"
        borderBottomLeftRadius="0.3rem;"
        animate={sidebarHandleControls}
        onClick={() => {
          dispatch(toggleCreatePlaylistSidebar(true));
        }}
      >
        <RiPlayListAddLine fontSize="2rem" />
      </MotionDiv>
      <MotionDiv
        display="none"
        w="100%"
        flexDirection="column"
        animate={sidebarInnerControls}
      >
        <Flex justify="space-between">
          <Text fontSize="1.5rem" mb="20px">
            Create Playlist
          </Text>

          <CloseButton
            onClick={() => {
              dispatch(toggleCreatePlaylistSidebar(false));
            }}
            size="sm"
          />
        </Flex>
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
      </MotionDiv>
    </MotionDiv>
  );
}
