import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
} from "@chakra-ui/core";
import React, { ReactElement, useRef, useState } from "react";
import { connect } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";
import { GiFireWave } from "react-icons/gi";
import { Link } from "react-router-dom";
import { ThunkResult } from "../types";
import { bindActionCreators } from "redux";
import { songSearch } from "../actions";
import { ThunkDispatch } from "redux-thunk";
import { AppActions } from "../actions/types";
import { debounce } from "../util/debounce";
interface HeaderProps {
  songSearch: (val: string) => ThunkResult<void>;
}
// const debounceSearch = debounce();

function Header({ songSearch }: HeaderProps): ReactElement {
  const [searchInputValue, setSearchInputValue] = useState("");
  const debounceSearch = useRef(
    debounce((value) => {
      songSearch(value);
    }, 1000)
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
    debounceSearch.current(event.target.value);
  };

  return (
    <Flex
      position="fixed"
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
          <Link to="/">Your Playlists</Link>
        </ListItem>
        <ListItem ml="10%">
          <Link to="/">Create new Playlist</Link>
        </ListItem>
      </List>
    </Flex>
  );
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AppActions>) => ({
  songSearch: bindActionCreators(songSearch, dispatch),
});

export default connect(null, mapDispatchToProps)(Header);
