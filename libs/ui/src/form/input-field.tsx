import { TextField, type TextFieldProps } from "./text-field"

export type InputFieldProps = TextFieldProps

export function InputField(props: TextFieldProps) {
  return <TextField {...props} />
}
