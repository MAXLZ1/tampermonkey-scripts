import "./index.css";
type WLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

export default function WLink({ children, className, ...rest }: WLinkProps) {
  return (
    <a {...rest} className={`weibo-link ${className}`}>
      {children}
    </a>
  );
}
