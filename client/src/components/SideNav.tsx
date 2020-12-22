/** @jsx jsx */
import {
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  VStack,
  Avatar,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useHistory, Link as RouterLink } from "react-router-dom";
import { signOut } from "../actions";
import { AppState } from "../reducers";
import { FaUserNinja } from "react-icons/fa";
import { jsx, css } from "@emotion/react";
import SourceSelector from "./SourceSelector";

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

  return (
    <Flex
      direction="column"
      position="sticky"
      top="0"
      background="white"
      justifyContent="left"
      w="100%"
      h="100%"
      align="flex-start"
      borderBottom="1px solid #A31709"
      zIndex="100"
      padding="2.4rem 20%"
    >
      <VStack spacing={4} align="flex-start">
        <VStack
          align="center"
          css={css`
            margin-bottom: 50px;
            align-self: center;
          `}
        >
          <Avatar icon={<FaUserNinja />}></Avatar>
          <Menu>
            <MenuButton variant="outline" size="sm" as={Button}>
              <Flex>{displayName}</Flex>
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
        </VStack>

        <Link as={RouterLink} to="/">
          Home
        </Link>

        <Flex
          height="min-content"
          align="center"
          css={css`
            button {
              padding-left: 0;
            }
          `}
        >
          <SourceSelector
            variant="none"
            connectToSpotifyModalToggle={connectToSpotifyModalToggle}
          />
        </Flex>

        <Link mr="1rem">Playlists</Link>

        <Link
          onClick={() => {
            dispatch(toggleCreatePlaylistSidebar(true));
          }}
          mr="1rem"
        >
          Create a Playlist
        </Link>
      </VStack>
    </Flex>
  );
}
