import { Flex, Text } from "@chakra-ui/core";
import React, { ReactElement } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { AppState } from "../reducers";
import SearchResultList from "./SearchResultList";

export default function SearchResultContainer({
  songSearchResults,
}: {
  songSearchResults: AppState["songSearchResult"];
}): ReactElement {
  //Build results based on values from songSearchResults
  const results: (ReactElement | null)[] = [];

  if (songSearchResults.spotify !== null) {
    if (songSearchResults.spotify.error) {
      //if there is an error, push error message
      results.push(
        <Text key="spotify">{songSearchResults.spotify.error?.message}</Text>
      );
    } else {
      if (songSearchResults.spotify.items?.length > 0) {
        //if there is at least 1 item in the response, show that
        results.push(
          <Droppable
            isDropDisabled={true}
            droppableId={"spotifySearchResultContainer"}
          >
            {(provided) =>
              songSearchResults.spotify !== null ? (
                <Flex
                  direction="row"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <SearchResultList
                    key="spotify"
                    source="Spotify"
                    results={songSearchResults.spotify.items}
                  />
                </Flex>
              ) : (
                <></>
              )
            }
          </Droppable>
        );
      } else {
        //else nothing
        results.push(null);
      }
    }
  } else {
    results.push(null);
  }

  if (songSearchResults.youtube) {
    if (songSearchResults.youtube.error) {
      //if there is an error, push error message
      results.push(
        <Text key="youtube">{songSearchResults.youtube.error?.message}</Text>
      );
    } else {
      if (songSearchResults.youtube.items?.length > 0) {
        //if there is at least 1 item in the response, show that
        results.push(
          <Droppable
            isDropDisabled={true}
            droppableId={"youTubeSearchResultContainer"}
          >
            {(provided) =>
              songSearchResults.youtube !== null ? (
                <Flex
                  direction="row"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <SearchResultList
                    key={"youtube"}
                    source="YouTube"
                    results={songSearchResults.youtube.items}
                  />
                </Flex>
              ) : (
                <></>
              )
            }
          </Droppable>
        );
        //else nothing
      } else results.push(null);
    }
  } else {
    results.push(null);
  }

  return (
    <Flex direction="row" w="100%" h="100%" overflow="scroll">
      {results}
    </Flex>
  );
}
