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

export default function DraggableSearchResult(props: Props): ReactElement {
  const { imageUrl, index, name } = props;
  return (
    <Draggable
      draggableId={imageUrl[0].url + name}
      index={index}
      key={name + imageUrl[0].url}
    >
      {(provided, snapshot) => {
        return (
          <React.Fragment>
            <Flex
              alignContent="center"
              {...provided.dragHandleProps}
              {...provided.draggableProps}
              ref={provided.innerRef}
              className="DraggableSearchResult"
              position="relative"
            >
              <SearchResult playlistItem {...props} />
            </Flex>
            {/* The duplicated component below is rendered so we don't get a stutter when we try to load the image */}
            <Box
              className="HIDDEN"
              css={css`
                display: ${snapshot.isDragging ? "block" : "none"};
                pointer-events: "none";

                & ~ div {
                  transform: ${snapshot.isDragging && "none !important"};
                }
              `}
            >
              <SearchResult playlistItem {...props} />
            </Box>
          </React.Fragment>
        );
      }}
    </Draggable>
  );
}
