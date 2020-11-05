import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/core";
import React, { ReactElement, useEffect } from "react";
import { PLAYER_NAME } from "../util/appVariables";

export default function ConnectToSpotify({}): ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
              To access your spotify songs, you need to connect to a Spotify on
              your computer or mobile device.
            </Text>
            <Text>
              Log in to Spotify to get started{" "}
              <span style={{ color: "red" }}>{PLAYER_NAME}</span>
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
