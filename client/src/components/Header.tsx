import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Text,
  Link as ChakLink,
} from "@chakra-ui/core";
import React, { ReactElement, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";
import { GiFireWave } from "react-icons/gi";
import { Link, useHistory } from "react-router-dom";
import { signOut, songSearch } from "../actions";
import { debounce } from "../util/debounce";
import { AppState } from "../reducers";
import { setCreatePlaylistSidebar } from "../actions/createPlaylistSidebarActions";

export default function Header(): ReactElement {
  const history = useHistory();
  const dispatch = useDispatch();
  const displayName = useSelector(
    (state: AppState) => state.auth.userData?.displayName
  );
  const [searchInputValue, setSearchInputValue] = useState("");
  const debounceSearch = useRef(
    debounce((value) => {
      dispatch(songSearch(value));
    }, 1000)
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
    console.log({ value: event.target.value });
    debounceSearch.current(event.target.value);
  };

  return (
    <Flex
      position="sticky"
      top="0"
      background="grey"
      justifyContent="left"
      w="100%"
      h="7%"
      align="center"
    >
      <Box
        background="blue"
        style={{ placeItems: "center" }}
        w="10%"
        display="grid"
        onClick={() => {
          history.push("/");
        }}
      >
        <GiFireWave fontSize={70} />
      </Box>
      <Box pl="10" background="grey">
        <InputGroup>
          <Input type="text" onChange={handleChange} value={searchInputValue} />
          <InputRightElement>
            <AiOutlineSearch />
          </InputRightElement>
        </InputGroup>
      </Box>

      <List
        h="100%"
        ml="6%"
        display="flex"
        flexDirection="row"
        alignItems="center"
        w="20%"
      >
        <ListItem ml="10%">
          <Link to="/playlists">Your Playlists</Link>
        </ListItem>
        <ListItem ml="10%">
          <ChakLink
            as="button"
            onClick={() => {
              //go to home and show the playlist creator sidebar
              history.push("/");
              dispatch(setCreatePlaylistSidebar(true));
            }}
          >
            Create new Playlist
          </ChakLink>
        </ListItem>
      </List>
      <Box>{displayName}</Box>
      <Button
        ml="auto"
        onClick={() => {
          dispatch(signOut());
          history.push("/");
        }}
      >
        Log out
      </Button>
    </Flex>
  );
}
