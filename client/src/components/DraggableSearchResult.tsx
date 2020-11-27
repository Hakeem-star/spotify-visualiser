import { Box, Flex } from "@chakra-ui/react";
import { css } from "@emotion/react";
import React, { ReactElement } from "react";
import { Draggable } from "react-beautiful-dnd";
import { playlistItemSongsType } from "../actions/types";

import SearchResult from "./SearchResult";

interface Props {
  imageUrl: string;
  name: string;
  artist: string;
  year: string;
  url: string;
  source: string;
  index: number;
  context: playlistItemSongsType[];
}

export default function DraggableSearchResult(props: Props): ReactElement {
  const { imageUrl, index } = props;

  return (
    <Draggable draggableId={imageUrl} index={index} key={index + imageUrl}>
      {(provided, snapshot) => (
        <React.Fragment>
          <Flex
            alignContent="center"
            {...provided.dragHandleProps}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <SearchResult {...props} />
          </Flex>
          {snapshot.isDragging && (
            <Box>
              <SearchResult
                {...props}
                // css={css`
                //   ~ div {
                //     transform: none !important;
                //   }
                // `}
              />
            </Box>
          )}
        </React.Fragment>
      )}
    </Draggable>
  );
}
