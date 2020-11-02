import React, { ReactElement } from "react";
import { Formik, Form, Field, ErrorMessage, useField } from "formik";
import { Button, Flex, Input } from "@chakra-ui/core";

const MyTextInput = ({
  label,
  ...props
}: {
  label: any;
  name: string;
  id?: string;
  type?: string;
  placeholder?: any;
}) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name}>{label}</label>
      <Input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export default function SignUp({
  firebase,
  login = false,
  handleSubmit,
}: {
  firebase: any;
  login?: boolean;
  handleSubmit?: () => void;
}): ReactElement {
  return (
    <Flex margin="auto" width="40%" direction="column">
      <Button>Sign up with Google</Button>
      <p>Sign up with email</p>
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validate={(values) => {
          const errors: { email?: string; password?: string } = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          if (!values.password) {
            errors.password = "Required";
          } else if (values.password.length > 8) {
            errors.password = "Must be 8 characters or less";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          firebase
            .auth()
            .createUserWithEmailAndPassword(values.email, values.password)
            .then((...args: any) => {
              console.log("Registered", args);
            })
            .catch(function (error: any) {
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
              // [START_EXCLUDE]
              if (errorCode == "auth/weak-password") {
                alert("The password is too weak.");
              } else {
                alert(errorMessage);
              }
              console.log(error);
              // [END_EXCLUDE]
            });
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex direction="column">
              {login ? null : (
                <MyTextInput
                  label="Display Name"
                  name="display_name"
                  type="text"
                />
              )}

              <MyTextInput label="Email" name="email" type="email" />
              <MyTextInput label="Password" name="password" type="password" />
              <Button type="submit" isDisabled={isSubmitting}>
                Submit
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </Flex>
  );
}
