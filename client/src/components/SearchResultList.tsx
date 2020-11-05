import { Flex, PseudoBox, Heading } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { remappedSearchResult } from "../types";
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
    <Flex direction="column">
      <Heading>{source}</Heading>
      {results.map((item) => {
        return (
          <SearchResult
            source={source}
            key={item.name}
            imageUrl={item.imageUrl}
            name={item.name}
            artist={item.artist}
            year={item.year}
            url={item.url}
          />
        );
      })}
    </Flex>
  );
}
