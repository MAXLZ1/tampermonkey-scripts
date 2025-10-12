import { createContext, useContext } from "react";

export type FormContextType<T = any> = {
  labelCol?: number;
  wrapperCol?: number;
  values?: T;
  setFieldValue?: (name: string, value: any) => void;
};

const FormContext = createContext<FormContextType<any> | null>(null);

export const useFormContext = <T = any,>() => {
  const ctx = useContext(FormContext) as FormContextType<T> | null;
  return ctx;
};

export default FormContext;
