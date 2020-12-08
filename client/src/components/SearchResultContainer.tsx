/** @jsx jsx @jsxFrag */
/* @jsxFrag React.Fragment */

import { Flex, SimpleGrid, Text, Divider } from "@chakra-ui/react";
import { jsx, css } from "@emotion/react";
import React, { ReactElement } from "react";
import { Droppable } from "react-beautiful-dnd";
import { SPOTIFY, YOUTUBE } from "../actions/types";
import { AppState } from "../reducers";
import { insertIntoArray } from "../util/insertIntoArray";
import { SearchListMaker } from "./SearchListMaker";
import SearchResultList from "./SearchResultList";
import ScrollContainer from "react-indiana-drag-scroll";

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

export default function SearchResultContainer({
  songSearchResults,
}: {
  songSearchResults: AppState["songSearchResult"];
}): ReactElement {
  // useEffect(() => {
  //   //Mount drag scrolling for header
  // }, []);
  return (
    <ScrollContainer
      ignoreElements=".DraggableSearchResult"
      hideScrollbars={false}
      style={{
        display: "flex",
        padding: "0 30px",
        width: "100%",
        height: "100%",
        overflow: "auto",
      }}
      css={scrollbarStyle}
    >
      {/* {results} */}
      <SearchListMaker results={songSearchResults[SPOTIFY]} id={SPOTIFY} />
      <SearchListMaker results={songSearchResults[YOUTUBE]} id={YOUTUBE} />
    </ScrollContainer>
  );
}
