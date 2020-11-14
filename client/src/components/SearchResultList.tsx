import { Heading } from "@chakra-ui/core";
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
    <div>
      <Heading>{source}</Heading>
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
    </div>
  );
}
