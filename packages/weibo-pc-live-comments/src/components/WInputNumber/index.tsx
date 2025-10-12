import { useControllableState } from "../../hooks";
import { useFormContext } from "../WForm/FormContext";
import { useFormItemContext } from "../WFormItem/FormItemContext";
import "./index.css";
import { useRef, useState, useEffect } from "react";

type WInputNumberProps = {
  defaultValue?: number;
  value?: number;
  className?: string;
  addonAfter?: React.ReactNode;
  step?: number;
  min?: number;
  max?: number;
  precision?: number;
  onChange?: (value: number) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

export default function WInputNumber(props: WInputNumberProps) {
  const {
    value,
    onChange,
    name: nameInProps,
    defaultValue,
    className,
    addonAfter,
    step = 1,
    min = Number.MIN_SAFE_INTEGER,
    max = Number.MAX_SAFE_INTEGER,
    precision,
    ...rest
  } = props;

  const formContext = useFormContext();
  const formItemContext = useFormItemContext();
  const stepTimeout = useRef<number | null>(null);
  const stepInterval = useRef<number | null>(null);
  let name = nameInProps;
  if (formItemContext) {
    const { name: nameInContext } = formItemContext;
    if (name === undefined) name = nameInContext;
  }

  let realDefaultValue = defaultValue;
  if (formContext && name && realDefaultValue === undefined) {
    realDefaultValue = formContext.values?.[name];
  }

  const [currentValue, setCurrentValue] = useControllableState<number>({
    value,
    defaultValue: realDefaultValue,
    onChange,
  });
  const [inputValue, setInputValue] = useState(currentValue?.toString() || "");

  const isMaxReached = currentValue !== undefined && currentValue >= max;
  const isMinReached = currentValue !== undefined && currentValue <= min;

  useEffect(() => {
    if (formContext && name !== undefined) {
      formContext.setFieldValue?.(name, currentValue);
    }
  }, [currentValue]);

  useEffect(() => {
    if (defaultValue !== undefined && formContext && name) {
      formContext.setFieldValue?.(name, defaultValue);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // 先只更新 input 显示，不校验
  };

  const handleBlur = () => {
    let num = Number(inputValue);

    if (Number.isNaN(num)) {
      num = currentValue || min || 0;
    }

    if (num < min) num = min;
    if (num > max) num = max;

    num = formatValue(num);

    setCurrentValue(num);
    setInputValue(num.toString()); // 不可删除
  };

  const formatValue = (num: number) => {
    if (precision !== undefined) {
      return Number(num.toFixed(precision));
    }
    return num;
  };

  const clampValue = (num: number) => {
    if (num < min) return min;
    if (num > max) return max;
    return num;
  };

  const applyStep = (direction: "up" | "down") => {
    setCurrentValue((prev) => {
      let next = clampValue(
        formatValue(prev + (direction === "up" ? step : -step)),
      );
      setInputValue(next.toString());

      // 超出边界停止长按
      if (
        (direction === "up" && next >= max) ||
        (direction === "down" && next <= min)
      ) {
        stopStepping();
      }

      return next;
    });
  };

  const startStepping = (direction: "up" | "down") => {
    applyStep(direction);
    stepTimeout.current = setTimeout(() => {
      stepInterval.current = setInterval(() => applyStep(direction), 100);
    }, 400);
  };

  const stopStepping = () => {
    if (stepTimeout.current) {
      clearTimeout(stepTimeout.current);
      stepTimeout.current = null;
    }
    if (stepInterval.current) {
      clearInterval(stepInterval.current);
      stepInterval.current = null;
    }
  };

  return (
    <div className={`woo-input-wrap  w-input-number ${className}`}>
      <div className="w-input-number-box">
        <input
          className="woo-input-main"
          name={name}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          step={step}
          max={max}
          min={min}
          {...rest}
          type="text"
        />
        <div className="w-input-number-handler-wrapper">
          <div
            className={`w-input-number-handler ${isMaxReached ? "ban" : ""}`}
            onMouseDown={() => startStepping("up")}
            onMouseUp={stopStepping}
            onMouseLeave={stopStepping}
          >
            +
          </div>
          <div
            className={`w-input-number-handler ${isMinReached ? "ban" : ""}`}
            onMouseDown={() => startStepping("down")}
            onMouseUp={stopStepping}
            onMouseLeave={stopStepping}
          >
            -
          </div>
        </div>
      </div>
      {addonAfter && <div className="w-input-number-addon">{addonAfter}</div>}
    </div>
  );
}
