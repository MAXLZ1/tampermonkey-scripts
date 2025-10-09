import "./index.css";
import InfoSvg from "../../assets/info.svg?react";
import ErrorSvg from "../../assets/error.svg?react";
import SuccessSvg from "../../assets/success.svg?react";
import SpinSvg from "../../assets/spin.svg?react";

type MessageProps = {
  children?: React.ReactNode;
  type?: MessageType;
};

export type MessageType = "success" | "error" | "info" | "loading";

const iconMap = {
  info: <InfoSvg className="info" />,
  error: <ErrorSvg className="error" />,
  success: <SuccessSvg className="success" />,
  loading: <SpinSvg />,
};

export default function WMessage({ children, type }: MessageProps) {
  return (
    <div className="weibo-message">
      <div className="weibo-message-wrapper">
        <div className="weibo-message-content">
          <span className="message-action">{iconMap[type ?? "info"]}</span>
          {children}
        </div>
      </div>
    </div>
  );
}
