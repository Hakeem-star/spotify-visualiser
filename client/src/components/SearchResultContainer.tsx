/** @jsx jsx @jsxFrag */
/* @jsxFrag React.Fragment */

import { Flex, Text } from "@chakra-ui/react";
import { jsx, css } from "@emotion/react";
import React, { ReactElement } from "react";
import { Droppable } from "react-beautiful-dnd";
import { IoMdAdd } from "react-icons/io";
import { useSelector } from "react-redux";
import { SPOTIFY, YOUTUBE } from "../actions/types";
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
        <Text key={SPOTIFY}>{songSearchResults.spotify.error?.message}</Text>
      );
    } else {
      if (songSearchResults.spotify.items?.length > 0) {
        //if there is at least 1 item in the response, show that
        results.push(
          <Droppable
            key={SPOTIFY}
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
                    key={SPOTIFY}
                    source={SPOTIFY}
                    items={songSearchResults.spotify.items}
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
        <Text key={YOUTUBE}>{songSearchResults.youtube.error?.message}</Text>
      );
    } else {
      if (songSearchResults.youtube.items?.length > 0) {
        //if there is at least 1 item in the response, show that
        results.push(
          <Droppable
            key={YOUTUBE}
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
                    key={YOUTUBE}
                    source={YOUTUBE}
                    items={songSearchResults.youtube.items}
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
    <Flex direction="row" w="100%" h="100%" overflow="hidden">
      {results}
    </Flex>
  );
}
