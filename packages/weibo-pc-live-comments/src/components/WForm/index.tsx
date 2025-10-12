import FormContext from "./FormContext";
import { useState } from "react";

type WFormProps<T> = {
  children?: React.ReactNode;
  labelCol?: number;
  wrapperCol?: number;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>, values: T) => void;
  initialValues?: T;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">;

export default function WForm<T extends Record<string, any>>(
  props: WFormProps<T>,
) {
  const {
    children,
    labelCol,
    wrapperCol,
    onSubmit,
    initialValues,
    ...formProps
  } = props;
  const [values, setValues] = useState<T>(initialValues ?? ({} as T));

  const setFieldValue = (name: string, value: T) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.(e, values);
  };

  return (
    <form {...formProps} onSubmit={handleSubmit}>
      <FormContext value={{ labelCol, wrapperCol, values, setFieldValue }}>
        {children}
      </FormContext>
    </form>
  );
}
