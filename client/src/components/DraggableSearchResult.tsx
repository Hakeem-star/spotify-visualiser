/** @jsx jsx */
import { Box, Flex } from "@chakra-ui/core";
import { css, jsx } from "@emotion/core";
import React, { ReactElement } from "react";
import { Draggable } from "react-beautiful-dnd";
import { playlistItemType } from "../actions/types";

import SearchResult from "./SearchResult";

interface Props {
  imageUrl: string;
  name: string;
  artist: string;
  year: string;
  url: string;
  source: string;
  index: number;
  context: playlistItemType[];
}

export default function DraggableSearchResult(props: Props): ReactElement {
  const { imageUrl, index } = props;

  return (
    <Draggable draggableId={imageUrl} index={index} key={index + imageUrl}>
      {(provided, snapshot) => (
        <React.Fragment>
          <Box
            height="200px"
            w="200px"
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <SearchResult {...props} />
          </Box>
          {snapshot.isDragging && (
            <Box>
              <SearchResult
                {...props}
                css={css`
                  ~ div {
                    transform: none !important;
                  }
                `}
              />
            </Box>
          )}
        </React.Fragment>
      )}
    </Draggable>
  );
}
