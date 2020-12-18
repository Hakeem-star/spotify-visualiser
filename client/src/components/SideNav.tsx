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
import { RiPlayListFill, RiPlayListAddLine } from "react-icons/ri";
import { BsMusicNote } from "react-icons/bs";

import { Link, useHistory } from "react-router-dom";
import { signOut, songSearch, updateSongSources } from "../actions";
import { debounce } from "../util/debounce";
import { AppState } from "../reducers";
import { FaUserNinja } from "react-icons/fa";
import { jsx, css } from "@emotion/react";
import SourceSelector from "./SourceSelector";
import SourceSelectorOptions from "./SourceSelectorOptions";

import { HamburgerIcon } from "@chakra-ui/icons";

import { GUEST } from "../actions/types";
import { toggleCreatePlaylistSidebar } from "../actions/createPlaylistSidebarActions";
import { useMobileBreakpoint } from "../util/mobileBreakpoint";

interface Props {
  connectToSpotifyModalToggle: { open: () => void; close: () => void };
}

export default function SideNav({
  connectToSpotifyModalToggle,
}: Props): ReactElement {
  const history = useHistory();
  const dispatch = useDispatch();
  const displayName = useSelector(
    (state: AppState) => state.auth.userData?.displayName || GUEST
  );

  const mobileScreenSize = useMobileBreakpoint();

  return (
    <Flex
      position="sticky"
      top="0"
      background="white"
      justifyContent="left"
      w="100%"
      h="100%"
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
            <Link
              css={css`
                margin-left: 2rem;
                margin-right: auto;
                height: 100%;
              `}
              to="/"
              onClick={() => {
                dispatch(toggleCreatePlaylistSidebar(true));
              }}
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
                  <Text mr="1rem">Create a Playlist</Text>
                  <RiPlayListAddLine />
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
        // On Mobile
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
              <MenuGroup title="Playlists">
                <MenuItem
                  onClick={() => {
                    history.push("/playlists");
                  }}
                >
                  Your Playlists
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(toggleCreatePlaylistSidebar(true));
                    history.push("/");
                  }}
                >
                  Create a Playlist
                </MenuItem>
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
