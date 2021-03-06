import { Input } from "@chakra-ui/react";
import { useField } from "formik";
import React, { ReactElement } from "react";

export const MyTextInput = ({
  label,
  value,
  setValue,
  ...props
}: {
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<string>>;
  label: any;
  name: string;
  id?: string;
  type?: string;
  placeholder?: any;
}): ReactElement => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input> and also replace ErrorMessage entirely.
  const [field, meta] = useField(props);
  return (
    <>
      <label
        style={{ display: "block", marginBottom: "20px" }}
        htmlFor={props.id || props.name}
      >
        {label}
      </label>
      <Input className="text-input" {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};
