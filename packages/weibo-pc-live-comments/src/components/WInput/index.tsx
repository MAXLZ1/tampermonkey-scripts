type WInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function WInput({ className, ...props }: WInputProps) {
  return (
    <div className={`woo-input-wrap ${className}`}>
      <input className="woo-input-main" {...props} />
    </div>
  );
}
