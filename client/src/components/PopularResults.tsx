import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../reducers";
import SearchResultContainer from "./SearchResultContainer";

export default function PopularResults(): ReactElement {
  const songSearchResults = useSelector(
    (state: AppState) => state.songSearchResult
  );
  return <SearchResultContainer songSearchResults={songSearchResults} />;
}
