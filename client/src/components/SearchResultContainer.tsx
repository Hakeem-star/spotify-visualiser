import { Flex, Text } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../reducers";
import SearchResultList from "./SearchResultList";

export default function SearchResultContainer(): ReactElement {
  const songSearchResults = useSelector(
    (state: AppState) => state.songSearchResults
  );
  console.log({ songSearchResults });

  //Build results based on values from songSearchResults

  const results = [];

  if (songSearchResults.spotify.error) {
    //if there is an error, push error message
    results.push(<Text>{songSearchResults.spotify.error?.message}</Text>);
  } else {
    if (songSearchResults.spotify.items?.length > 0) {
      //if there is at least 1 item in the response, show that
      results.push(
        <SearchResultList
          source="Spotify"
          results={songSearchResults.spotify.items}
        />
      );
    } else {
      //else nothing
      results.push(null);
    }
  }

  if (songSearchResults.youtube.error) {
    //if there is an error, push error message

    results.push(<Text>{songSearchResults.youtube.error?.message}</Text>);
  } else {
    if (songSearchResults.youtube.items?.length > 0) {
      //if there is at least 1 item in the response, show that
      results.push(
        <SearchResultList
          source="YouTube"
          results={songSearchResults.youtube.items}
        />
      );
      //else nothing
    } else results.push(null);
  }

  return (
    <Flex direction="row" w="100%" h="100%" justifyContent="space-between">
      {results}
    </Flex>
  );
}
