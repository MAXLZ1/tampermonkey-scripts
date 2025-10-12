import React, { CSSProperties } from "react";
import "./index.css";
import { useFormContext } from "../WForm/FormContext";
import FormItemContext from "../WFormItem/FormItemContext";
import Tooltip, { TooltipProps } from "../Tooltip";

type WFormItemProps = {
  children: React.ReactNode;
  label?: string;
  className?: string;
  name?: string;
  align?: CSSProperties["alignItems"];
  labelCol?: number;
  wrapperCol?: number;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  tooltip?: TooltipProps & { icon?: React.ReactNode };
};

const unit = 100 / 24;

export default function WFormItem(props: WFormItemProps) {
  const {
    children,
    label,
    className,
    align,
    labelProps,
    name,
    labelCol,
    wrapperCol,
    tooltip,
  } = props;
  const formContext = useFormContext();
  const alignItems = align ?? "center";
  let currentLabelCol = labelCol,
    currentWrapperCol = wrapperCol;
  let icon: React.ReactNode | undefined, tooltipProps: TooltipProps | undefined;

  if (formContext) {
    const { labelCol, wrapperCol } = formContext;
    if (currentLabelCol === undefined) {
      currentLabelCol = labelCol;
    }
    if (currentWrapperCol === undefined) {
      currentWrapperCol = wrapperCol;
    }
  }
  currentLabelCol = currentLabelCol ?? 6;
  currentWrapperCol = currentWrapperCol ?? 18;
  const labelStyle = { flex: `0 0 ${unit * currentLabelCol}%` };
  const wrapperStyle = { flex: `0 0 ${unit * currentWrapperCol}%` };

  if (tooltip) {
    const { icon: iconFromTooltip, ...restTooltipProps } = tooltip;
    icon = iconFromTooltip;
    tooltipProps = restTooltipProps;
  }

  return (
    <div
      className={`form-item ${className ?? ""}`}
      style={{ alignItems: alignItems }}
    >
      <FormItemContext.Provider value={{ name }}>
        <div style={labelStyle} className="form-item-label">
          {label && (
            <label htmlFor={name} {...labelProps}>
              {label}
              {icon && (
                <Tooltip {...tooltipProps}>
                  <span className="form-item-label-icon">{icon}</span>
                </Tooltip>
              )}
            </label>
          )}
        </div>
        <div style={wrapperStyle} className="form-item-control-content">
          {children}
        </div>
      </FormItemContext.Provider>
    </div>
  );
}
