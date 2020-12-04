import { Divider, Flex, Heading } from "@chakra-ui/react";
import { css } from "@emotion/react";
import React, { ReactElement } from "react";
import { remappedSearchResult } from "../types";
import { insertIntoArray } from "../util/insertIntoArray";
import DraggableSearchResult from "./DraggableSearchResult";

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
  items: remappedSearchResult["items"];
}

export default function SearchResultList({
  source,
  items,
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
      <Heading background="white" mb="20px" pb="10px">
        {source}

        {/* <Divider mt="10px" mb="20px" /> */}
      </Heading>
      <Flex
        w="100%"
        overflow="overlay"
        flexDirection="column"
        css={scrollbarStyle}
      >
        {/* Issue is these don't create a key for the children */}
        {insertIntoArray(
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
        )}
      </Flex>
    </Flex>
  );
}
