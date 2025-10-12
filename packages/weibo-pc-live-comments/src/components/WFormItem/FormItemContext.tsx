import { createContext, useContext } from "react";

type FormItemContextType = {
  name?: string;
};

const FormItemContext = createContext<FormItemContextType | null>(null);

export const useFormItemContext = () => {
  const ctx = useContext(FormItemContext);
  return ctx;
};

export default FormItemContext;
