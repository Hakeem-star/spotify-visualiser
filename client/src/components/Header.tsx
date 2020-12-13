/** @jsx jsx */
import {
  InputRightElement,
  Box,
  Button,
  Flex,
  Grid,
  Input,
  InputGroup,
  List,
  ListItem,
  Text,
  Link as ChakLink,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  MenuItem,
  InputRightAddon,
  Switch,
  useBreakpointValue,
  MenuGroup,
} from "@chakra-ui/react";
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { AiOutlineSearch } from "react-icons/ai";
import { GiFireWave } from "react-icons/gi";
import { RiPlayListFill } from "react-icons/ri";
import { BsMusicNote } from "react-icons/bs";

import { Link, useHistory } from "react-router-dom";
import { signOut, songSearch } from "../actions";
import { debounce } from "../util/debounce";
import { AppState } from "../reducers";
import { FaUserNinja } from "react-icons/fa";
import { jsx, css } from "@emotion/react";
import SourceSelector from "./SourceSelector";
import SourceSelectorOptions from "./SourceSelectorOptions";

import { HamburgerIcon } from "@chakra-ui/icons";

import { GUEST } from "../actions/types";

interface Props {
  connectToSpotifyModalToggle: { open: () => void; close: () => void };
}

export default function Header({
  connectToSpotifyModalToggle,
}: Props): ReactElement {
  const history = useHistory();
  const dispatch = useDispatch();
  const displayName = useSelector(
    (state: AppState) => state.auth.userData?.displayName || GUEST
  );
  const [searchInputValue, setSearchInputValue] = useState("");
  const debounceSearch = useRef(
    debounce((value) => {
      dispatch(songSearch(value));
    }, 1000)
  );

  const [popOverOpenState, setPopOverOpenState] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
    debounceSearch.current(event.target.value);
  };

  const mobileScreenSize = useBreakpointValue({ base: true, md: false });
  return (
    <Flex
      as="header"
      position="sticky"
      top="0"
      background="white"
      justifyContent="left"
      w="100%"
      h="3em"
      align="center"
      borderBottom="1px solid #A31709"
      zIndex="100"
      padding="0.4rem 0"
    >
      <Box
        cursor="pointer"
        className="logo"
        style={{ placeItems: "center" }}
        minW="10%"
        h="100%"
        overflow="hidden"
        display="grid"
        onClick={() => {
          history.push("/");
        }}
      >
        <GiFireWave fontSize={70} />
      </Box>
      <InputGroup
        overflow="hidden"
        className="search-input"
        onFocus={() => setPopOverOpenState(true)}
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
      {!mobileScreenSize ? (
        <React.Fragment>
          <SourceSelector
            connectToSpotifyModalToggle={connectToSpotifyModalToggle}
          />
          <Flex
            flex="1"
            height="100%"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Link
              css={css`
                margin-left: 2rem;
                margin-right: auto;
                height: 100%;
              `}
              to="/playlists"
            >
              <Button h="100%" variant="outline">
                <Flex
                  h="100%"
                  css={css`
                    display: flex;
                    align-self: flex-start;
                    white-space: nowrap;
                  `}
                  justify="space-between"
                  align="center"
                >
                  <Text mr="1rem">Playlists</Text>
                  <RiPlayListFill />
                </Flex>
              </Button>
            </Link>
            <Menu>
              <MenuButton variant="outline" size="sm" mr="1rem" as={Button}>
                <Flex>
                  {displayName}
                  <FaUserNinja
                    css={css`
                      margin-left: 10px;
                    `}
                  />
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    dispatch(signOut(displayName));
                    history.push("/");
                  }}
                >
                  Log out
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </React.Fragment>
      ) : (
        <Flex
          flex="1"
          height="100%"
          justifyContent="flex-end"
          alignItems="center"
          mr={["0rem", "1rem"]}
        >
          <Menu>
            <MenuButton variant="outline" size="sm" as={Button}>
              <HamburgerIcon w={8} h={8} />
            </MenuButton>
            <MenuList>
              <MenuGroup title="Sources">
                <SourceSelectorOptions
                  connectToSpotifyModalToggle={connectToSpotifyModalToggle}
                />
              </MenuGroup>
              <MenuGroup title="Account">
                <MenuItem
                  onClick={() => {
                    dispatch(signOut(displayName));
                    history.push("/");
                  }}
                >
                  Log out
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>
      )}
    </Flex>
  );
}
