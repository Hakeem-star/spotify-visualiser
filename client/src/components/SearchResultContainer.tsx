import { Flex } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { connect } from "react-redux";
import { AppState } from "../reducers";
import { songSearchResult } from "../types";
import SearchResultList from "./SearchResultList";

interface Props {
  songSearchResults: songSearchResult;
}

function SearchResultContainer({ songSearchResults }: Props): ReactElement {
  console.log(songSearchResults);
  if (
    songSearchResults.spotify.items &&
    songSearchResults.spotify.items.length > 0
  ) {
    return (
      <Flex direction="row" w="100" h="100">
        <SearchResultList
          source="Spotify"
          results={songSearchResults.spotify.items}
        />
        <SearchResultList
          source="YouTube"
          results={songSearchResults.youtube.items}
        />
      </Flex>
    );
  } else return <div>BOOO</div>;
}

const matchStateToProps = (state: AppState) => {
  return {
    songSearchResults: state.songSearchResults,
  };
};

export default connect(matchStateToProps)(SearchResultContainer);
