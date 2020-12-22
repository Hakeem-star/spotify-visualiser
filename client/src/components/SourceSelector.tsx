import { Flex, Button, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { css } from "@emotion/react";
import React, { ReactElement, useEffect, useState } from "react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import SourceSelectorOptions from "./SourceSelectorOptions";

interface Props {
  connectToSpotifyModalToggle: { open: () => void; close: () => void };
  variant?: string;
}
export default function SourceSelector({
  connectToSpotifyModalToggle,
  variant = "variant",
}: Props): ReactElement {
  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        variant={variant}
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
  );
}
