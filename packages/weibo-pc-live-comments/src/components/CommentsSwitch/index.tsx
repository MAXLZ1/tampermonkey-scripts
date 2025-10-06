import "./index.css";
import DanmuCloseSvg from "../../assets/danmu-close.svg?react";
import DanmuOpenSvg from "../../assets/danmu-open.svg?react";

type CommentSwitchProps = {
  checked: boolean;
  onClick?: (checked: boolean) => void;
};

export default function CommentSwitch({
  checked,
  onClick,
}: CommentSwitchProps) {
  const handleClick = () => {
    onClick?.(!checked);
  };

  return (
    <div onClick={handleClick}>
      {checked ? (
        <DanmuOpenSvg className="danmu-icon" />
      ) : (
        <DanmuCloseSvg className="danmu-icon" />
      )}
    </div>
  );
}
