import { ReactNode } from "react";

type WButtonProps = {
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function WButton({
  children,
  className,
  ...props
}: WButtonProps) {
  return (
    <button
      className={`woo-button-main woo-button-flat woo-button-primary woo-button-m woo-button-round ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
