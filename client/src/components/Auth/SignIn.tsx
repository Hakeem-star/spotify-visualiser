import React, { ReactElement, useEffect } from "react";
import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import AuthForm from "./AuthForm";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../actions";
import { AppState } from "../../reducers";
import FormErrorModal from "./FormErrorModal";

export default function SignIn(): ReactElement {
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
      <Button>Sign in with Google</Button>
      <p>Sign in with email</p>
      <AuthForm
        signInForm
        handleSubmit={(email, password, setSubmitting) => {
          dispatch(signIn(email, password, setSubmitting));
        }}
      />
    </Flex>
  );
}
