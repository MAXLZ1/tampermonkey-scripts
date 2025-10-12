import { useControllableState } from "../../hooks";
import { useFormContext } from "../WForm/FormContext";
import { useFormItemContext } from "../WFormItem/FormItemContext";
import { useEffect } from "react";
import "./index.css";

type WSwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChecked?: (checked: boolean) => void;
  name?: string;
};

export default function WSwitch(props: WSwitchProps) {
  const { checked, defaultChecked, onChecked, name: nameInProps } = props;

  const formContext = useFormContext();
  const formItemContext = useFormItemContext();
  let name = nameInProps;

  if (formItemContext) {
    const { name: nameInContext } = formItemContext;
    if (name === undefined) name = nameInContext;
  }

  let realDefault = defaultChecked;
  if (formContext && name && realDefault === undefined) {
    realDefault = formContext.values?.[name];
  }

  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: realDefault,
    onChange: onChecked,
  });

  const handleClick = () => {
    setIsChecked((prev) => {
      if (formContext && name !== undefined) {
        formContext.setFieldValue?.(name, !prev);
      }

      return !prev;
    });
  };

  useEffect(() => {
    if (defaultChecked !== undefined && formContext && name) {
      formContext.setFieldValue?.(name, defaultChecked);
    }
  }, []);

  return (
    <div
      className={`w-switch ${isChecked ? "checked" : ""}`}
      onClick={handleClick}
    >
      <div className="w-switch-button">
        <input
          className="w-switch-input"
          type="checkbox"
          name={name}
          checked={isChecked}
          readOnly
        />
        <div className="w-switch-thumb"></div>
      </div>
      <div className="w-switch-track"></div>
    </div>
  );
}
