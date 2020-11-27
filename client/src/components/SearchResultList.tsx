import { Flex, Heading } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { remappedSearchResult } from "../types";
import DraggableSearchResult from "./DraggableSearchResult";
import SearchResult from "./SearchResult";

interface Props {
  source: string;
  items: remappedSearchResult["items"];
}

export default function SearchResultList({
  source,
  items,
}: Props): ReactElement {
  return (
    <Flex overflow="auto" flexDirection="column" ml="30px" mt="30px">
      <Heading position="sticky" mb="30px">
        {source}
      </Heading>
      {items.map((item, index) => {
        return (
          <DraggableSearchResult
            context={items}
            {...item}
            index={index}
            key={item.url + index}
          />
        );
      })}
    </Flex>
  );
}
