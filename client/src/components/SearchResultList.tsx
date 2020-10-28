import { Flex, PseudoBox, Heading } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { AppState } from "../reducers";
import { songSearchResult } from "../types";
import SearchResult from "./SearchResult";

interface Props {
  header: string;
  results: {
    imageUrl: string;
    name: string;
    artist: string;
    year: string;
    url: string;
  }[];
}

export default function SearchResultList({
  results,
  header,
}: Props): ReactElement {
  return (
    <Flex direction="column">
      <Heading>{header}</Heading>
      {results.map((item) => {
        return (
          <SearchResult
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
