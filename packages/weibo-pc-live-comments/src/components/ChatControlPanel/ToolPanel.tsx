import "./ToolPanel.css";
import CloseSVG from "../../assets/close.svg?react";

type ToolPanelSlots = {
  title?: React.ReactNode;
  content?: React.ReactNode;
};

type ToolPanelProps = {
  children?: React.ReactNode;
  slots: ToolPanelSlots;
  open?: boolean;
  onClose?: () => void;
};

export default function ToolPanel({
  children,
  open,
  onClose,
  slots: { title, content },
}: ToolPanelProps) {
  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <>
      {children}
      <div className={`tool-panel-main ${open ? "open" : ""}`}>
        <div className="tool-panel-title">
          <span>{title}</span>
          <CloseSVG className="close-icon" onClick={handleClose} />
        </div>
        <div className="tool-panel-content">{content}</div>
      </div>
    </>
  );
}
