/** @jsx jsx @jsxFrag */
/* @jsxFrag React.Fragment */

import { Flex, SimpleGrid, Text, Divider } from "@chakra-ui/react";
import { jsx, css } from "@emotion/react";
import React, { ReactElement } from "react";
import { Droppable } from "react-beautiful-dnd";
import { SPOTIFY, YOUTUBE } from "../actions/types";
import { AppState } from "../reducers";
import { insertIntoArray } from "../util/insertIntoArray";
import SearchResultList from "./SearchResultList";

const scrollbarStyle = css`
  /* width */
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const VerticalResultsDivider = () => (
  <Divider
    orientation="vertical"
    height="93%"
    alignSelf="center"
    borderColor="#417AF0"
    m="0 3px"
  />
);

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
                  overflow="auto"
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
                  overflow="auto"
                  minW="400px"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  css={scrollbarStyle}
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
    results.push(<VerticalResultsDivider />);
  } else {
    results.push(null);
  }

  return (
    <SimpleGrid
      autoFlow="column"
      autoColumns="minmax(auto,20%);"
      direction="row"
      w="100%"
      h="100%"
      overflow="hidden"
    >
      {results}
    </SimpleGrid>
  );
}
