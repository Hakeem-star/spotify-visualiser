import { InputGroup, Input, InputRightElement } from "@chakra-ui/react";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { BsMusicNote } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { songSearch } from "../actions";
import { SPOTIFY } from "../actions/types";
import { AppState } from "../reducers";
import { debounce } from "../util/debounce";
import { useHistory } from "react-router-dom";

// const [popOverOpenState, setPopOverOpenState] = useState(false);

export const SearchBar = (): ReactElement => {
  const dispatch = useDispatch();
  const spotifyAuth = useSelector((state: AppState) => state.spotifyAuth);
  const songSources = useSelector((state: AppState) => state.songSources);
  const [searchInputValue, setSearchInputValue] = useState("");
  const history = useHistory();

  useEffect(() => {
    //On mount, make a search with no value to fetch the popular/most listened songs
    dispatch(songSearch(""));
  }, []);

  //If spotify login changes, perform the same search so the new results from sources shows up
  useEffect(() => {
    //Check the box when we confirm signin for Spotify
    if (spotifyAuth.isSignedIn) {
      if (!songSources.includes(SPOTIFY)) {
        dispatch(songSearch(searchInputValue));
      }
    }
  }, [spotifyAuth.isSignedIn]);

  const debounceSearch = useRef(
    debounce((value) => {
      dispatch(songSearch(value.trim()));

      //Take us to the homepage to see the search results when a search is performed
      if (history.location.pathname !== "/search") history.push("/search");
    }, 1000)
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
    debounceSearch.current(event.target.value);
  };

  return (
    <InputGroup
      overflow="hidden"
      className="search-input"
      // onFocus={() => setPopOverOpenState(true)}
      width="330px"
      height="100%"
    >
      <Input
        placeholder="Search for a song"
        name="Search for a song"
        type="text"
        onChange={handleChange}
        value={searchInputValue}
        height="100%"
      />
      <InputRightElement width="3rem" h="100%" color="gray.300">
        <BsMusicNote />
      </InputRightElement>
    </InputGroup>
  );
};
