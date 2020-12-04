/** @jsx jsx */
import { Box, Image, Flex } from "@chakra-ui/react";
import { jsx, css } from "@emotion/react";
import React, { ReactElement } from "react";
import { Draggable } from "react-beautiful-dnd";
import { playlistItemSongsType } from "../actions/types";

import SearchResult from "./SearchResult";

interface Props extends playlistItemSongsType {
  index: number;
  context: playlistItemSongsType[];
}

export default function DraggableCreatePlaylistItem(
  props: Props
): ReactElement {
  const { imageUrl, index, name } = props;

  return (
    <Draggable
      draggableId={"playlist" + imageUrl + name}
      index={index}
      key={imageUrl + name}
    >
      {(provided, snapshot) => {
        return (
          <React.Fragment>
            <Flex
              alignContent="center"
              {...provided.dragHandleProps}
              {...provided.draggableProps}
              ref={provided.innerRef}
              css={css`
                ${snapshot.isDropAnimating &&
                "transition-duration: 0.001s !important;"}
              `}
            >
              <SearchResult {...props} />
            </Flex>
          </React.Fragment>
        );
      }}
    </Draggable>
  );
}
