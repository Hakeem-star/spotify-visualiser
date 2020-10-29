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
            Please connect to this Spotify player from your device. <br />
            <br /> In your Spotify App, select{" "}
            <span style={{ color: "red" }}>{PLAYER_NAME}</span>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
