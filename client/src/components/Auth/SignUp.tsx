import React, { ReactElement, useEffect } from "react";
import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import AuthForm from "./AuthForm";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../actions";
import { AppState } from "../../reducers";
import FormErrorModal from "./FormErrorModal";

export default function SignUp(): ReactElement {
  const dispatch = useDispatch();
  const formError = useSelector((state: AppState) => state.formError);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    //Open the modal displaying the error message
    if (formError.count) {
      onOpen();
    }
  }, [formError, onOpen]);

  return (
    <Flex margin="auto" width="40%" direction="column">
      <FormErrorModal
        error={formError.error}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Button>Sign up with Google</Button>
      <p>Sign up with email</p>
      <AuthForm
        handleSubmit={(email, password, setSubmitting, displayName) => {
          dispatch(signUp(email, password, setSubmitting, displayName));
        }}
      />
    </Flex>
  );
}
