import { Flex, Button, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { css } from "@emotion/react";
import React, { ReactElement, useEffect, useState } from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import SourceSelectorOptions from "./SourceSelectorOptions";

interface Props {
  connectToSpotifyModalToggle: { open: () => void; close: () => void };
}
export default function SourceSelector({
  connectToSpotifyModalToggle,
}: Props): ReactElement {
  return (
    <Flex height="100%" align="center" ml="2rem">
      <Menu closeOnSelect={false}>
        <MenuButton
          variant="outline"
          height="100%"
          as={Button}
          rightIcon={<ChevronDownIcon />}
        >
          Sources
        </MenuButton>
        <MenuList minWidth="240px">
          <SourceSelectorOptions
            connectToSpotifyModalToggle={connectToSpotifyModalToggle}
          />
        </MenuList>
      </Menu>
    </Flex>
  );
}
