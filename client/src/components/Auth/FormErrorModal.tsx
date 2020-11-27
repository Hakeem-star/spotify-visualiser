import {
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { Link } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  error: string | null;
}

export default function FormErrorModal({
  isOpen,
  onClose,
  error,
}: Props): ReactElement {
  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Text>{error}</Text>
            {error.includes("in use") ? (
              <Text>
                <Link to="/sign-in">Sign In</Link>
              </Text>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  } else {
    return <></>;
  }
}
