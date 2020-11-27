/** @jsx jsx */
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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  MenuItem,
  InputRightAddon,
} from "@chakra-ui/react";
import React, { ReactElement, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";
import { GiFireWave } from "react-icons/gi";
import { Link, useHistory } from "react-router-dom";
import { signOut, songSearch } from "../actions";
import { debounce } from "../util/debounce";
import { AppState } from "../reducers";
import { setCreatePlaylistSidebar } from "../actions/createPlaylistSidebarActions";
import { FaUserNinja } from "react-icons/fa";
import { jsx, css } from "@emotion/react";
import SourceSelector from "./SourceSelector";

interface Props {
  connectToSpotifyModalToggle: { open: () => void; close: () => void };
}

export default function Header({
  connectToSpotifyModalToggle,
}: Props): ReactElement {
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

  const songSearchInputRef = useRef(null);
  const [popOverOpenState, setpopOverOpenState] = useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
    console.log({ value: event.target.value });
    debounceSearch.current(event.target.value);
  };
  return (
    <Flex
      position="sticky"
      top="0"
      background="#46484e"
      justifyContent="left"
      w="100%"
      h="7%"
      align="center"
      borderBottom="3px solid #A31709"
    >
      <Box
        style={{ placeItems: "center" }}
        w="10%"
        display="grid"
        onClick={() => {
          history.push("/");
        }}
      >
        <GiFireWave fontSize={70} />
      </Box>
      <InputGroup onFocus={() => setpopOverOpenState(true)} width="330px">
        <Input type="text" onChange={handleChange} value={searchInputValue} />
        <InputRightAddon>
          <AiOutlineSearch />
        </InputRightAddon>
      </InputGroup>
      <SourceSelector
        connectToSpotifyModalToggle={connectToSpotifyModalToggle}
      />

      <Flex
        flex="1"
        height="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <List
          h="100%"
          ml="50%"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          w="20%"
          color="white"
        >
          <ListItem
            css={css`
              height: calc(100% + 3px);
              display: grid;
              align-self: flex-start;
              place-items: center;
              transition: border 0.3s ease;
              &:hover {
                border-bottom: 3px solid blue;
              }
            `}
          >
            <Link to="/playlists">Your Playlists</Link>
          </ListItem>
          <ListItem
            css={css`
              height: calc(100% + 3px);
              display: grid;
              align-self: flex-start;
              place-items: center;
              transition: border 0.3s ease;
              &:hover {
                border-bottom: 3px solid blue;
              }
            `}
          >
            Visualiser
          </ListItem>
        </List>
        <Box></Box>

        <Menu>
          <MenuButton mr="100px" as={Button}>
            {displayName}
            <FaUserNinja
              css={css`
                margin-left: 10px;
              `}
            />
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={() => {
                dispatch(signOut());
                history.push("/");
              }}
            >
              Log out
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}
