import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

type InputFieldProps = any & {
  label: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({
  label,
  textarea,
  ...props
}) => {
  let InputOrText = Input;
  if (textarea) {
    InputOrText = Textarea as any;
  }
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>

      <InputOrText
        {...field}
        {...props}
        id={field.name}
        _hover={{
          borderColor: "teal.300",
        }}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
