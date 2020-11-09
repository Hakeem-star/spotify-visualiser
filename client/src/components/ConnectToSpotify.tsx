import {
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  Link as CLink,
  useDisclosure,
} from "@chakra-ui/core";
import React, { ReactElement, useEffect } from "react";
import { PLAYER_NAME } from "../util/appVariables";

import { FaSpotify } from "react-icons/fa";

export default function ConnectToSpotify({
  isOpen,
  onOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}): ReactElement {
  useEffect(() => {
    //We need to control the opening of the modal
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody m="20px">
            <Text>
              To access your spotify songs, you need to connect to a Spotify
              player on your computer or mobile device.
            </Text>
            <Text mt="20px">
              Log in to Spotify to get started{" "}
              <span style={{ color: "red" }}>{PLAYER_NAME}</span>
            </Text>
            <CLink href="http://localhost:3000/spotify/login">
              Sync Up <FaSpotify fontSize="50px" />
            </CLink>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
