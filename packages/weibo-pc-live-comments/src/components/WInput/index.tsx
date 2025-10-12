import { useControllableState } from "../../hooks";
import { useFormContext } from "../WForm/FormContext";
import { useFormItemContext } from "../WFormItem/FormItemContext";
import { useEffect } from "react";

type WInputProps = {
  defaultValue?: string | number;
  value?: string | number;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function WInput({
  defaultValue,
  className,
  ...props
}: WInputProps) {
  const { value, onChange, name: nameInProps, ...rest } = props;
  const formContext = useFormContext();
  const formItemContext = useFormItemContext();

  let name = nameInProps;
  if (formItemContext) {
    const { name: nameInContext } = formItemContext;
    if (name === undefined) name = nameInContext;
  }

  let realDefaultValue = defaultValue;
  if (formContext && name && realDefaultValue === undefined) {
    realDefaultValue = formContext.values?.[name];
  }

  const [currentValue, setCurrentValue] = useControllableState<string | number>(
    {
      value,
      defaultValue: realDefaultValue,
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCurrentValue(val);

    if (formContext && name !== undefined) {
      formContext.setFieldValue?.(name, val);
    }
    onChange?.(e);
  };

  useEffect(() => {
    if (defaultValue && formContext && name) {
      formContext?.setFieldValue?.(name, defaultValue);
    }
  }, []);

  return (
    <div className={`woo-input-wrap ${className}`}>
      <input
        className="woo-input-main"
        name={name}
        value={currentValue}
        onChange={handleChange}
        {...rest}
      />
    </div>
  );
}
