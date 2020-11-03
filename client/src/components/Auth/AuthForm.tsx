import { Flex, Button, Input } from "@chakra-ui/core";
import { Formik, useField, Form } from "formik";
import React, { ReactElement } from "react";

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

interface Props {
  signInForm?: boolean;
  handleSubmit: (
    email: string,
    password: string,
    setSubmitting: (isSubmitting: boolean) => void,
    displayName?: string
  ) => void;
}

export default function AuthForm({
  signInForm = false,
  handleSubmit,
}: Props): ReactElement {
  return (
    <div>
      <Formik
        initialValues={{ displayName: "", email: "", password: "" }}
        validate={(values) => {
          const errors: {
            email?: string;
            password?: string;
            displayName?: string;
          } = {};
          if (!signInForm) {
            if (!values.displayName) {
              errors.displayName = "Required";
            } else if (values.displayName.length < 5) {
              errors.displayName = "Must be 5 characters or less";
            }
          }
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          if (!values.password) {
            errors.password = "Required";
          } else if (values.password.length < 8) {
            errors.password = "Must be at least 8 characters";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values.email, values.password, values.displayName);
          handleSubmit(
            values.email,
            values.password,
            setSubmitting,
            values.displayName
          );
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Flex direction="column">
              {signInForm ? null : (
                <MyTextInput
                  label="Display Name"
                  name="displayName"
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
    </div>
  );
}
