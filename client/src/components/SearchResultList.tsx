import { Heading } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { remappedSearchResult } from "../types";
import DraggableSearchResult from "./DraggableSearchResult";
import SearchResult from "./SearchResult";

interface Props {
  source: string;
  results: remappedSearchResult["items"];
}

export default function SearchResultList({
  results,
  source,
}: Props): ReactElement {
  return (
    <div>
      <Heading>{source}</Heading>
      {results.map((item, index) => {
        return (
          <DraggableSearchResult
            source={source}
            index={index}
            key={item.url + index}
            imageUrl={item.imageUrl}
            name={item.name}
            artist={item.artist}
            year={item.year}
            url={item.url}
          />
        );
      })}
    </div>
  );
}
