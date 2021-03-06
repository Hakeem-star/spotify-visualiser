import { Divider, Flex, Heading, Box, Skeleton } from "@chakra-ui/react";
import { css } from "@emotion/react";
import React, { ReactElement } from "react";
import { remappedSearchResult } from "../types";
import { insertIntoArray } from "../util/insertIntoArray";
import DraggableSearchResult from "./DraggableSearchResult";
import { DragHandleIcon } from "@chakra-ui/icons";

const scrollbarStyle = css`
  ::-webkit-scrollbar {
    width: 10px;
    opacity: 0;
  }

  &:hover {
    ::-webkit-scrollbar-thumb {
      background: #888;
    }
  }
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #8880;
  }
`;

interface Props {
  source: string;
  items: remappedSearchResult["items"] | undefined;
  fetching: boolean;
}

export default function SearchResultList({
  source,
  items,
  fetching,
}: Props): ReactElement {
  return (
    <Flex
      className="SearchResultList"
      w="100%"
      overflow="hidden"
      flexDirection="column"
      mt="30px"
      p=" 0 10px 10px"
      borderRadius="10px"
      css={scrollbarStyle}
    >
      <Flex
        cursor="move"
        align="center"
        justify="space-between"
        mb="20px"
        p="5px"
      >
        <Box h="100%">
          <Heading background="white">{source}</Heading>
        </Box>
        <DragHandleIcon h={10} />
      </Flex>
      <Flex
        w="100%"
        overflow="overlay"
        flexDirection="column"
        css={scrollbarStyle}
      >
        {/* Issue is these don't create a key for the children */}
        {/* If fetching, show skeleton */}
        {!fetching
          ? items &&
            insertIntoArray(
              items.map((item, index) => {
                return (
                  <DraggableSearchResult
                    context={items}
                    {...item}
                    index={index}
                    key={item.url + item.name}
                  />
                );
              }),
              <Divider borderColor="#417AF0" m="3px 0" />
            )
          : //Skeletons for loading
            insertIntoArray(
              Array(10)
                .fill("")
                .map((val, index) => {
                  return (
                    <Skeleton
                      key={index}
                      //Same settings as SearchResult
                      flexShrink={0}
                      height="95px"
                      w="100%"
                      borderRadius="5px"
                    ></Skeleton>
                  );
                }),
              <Divider borderColor="#417AF0" m="3px 0" />
            )}
      </Flex>
    </Flex>
  );
}
