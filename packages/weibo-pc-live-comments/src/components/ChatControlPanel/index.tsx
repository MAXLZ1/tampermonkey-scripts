import "./index.css";
import BlockedMessageSvg from "../../assets/blocked-message.svg?react";
import ToolPanel from "./ToolPanel";
import BlockedWordForm from "../BlockedWordForm";
import BlcokedWordList from "../BlockedWordList";
import { useState } from "react";

type ChatControlPanelProps = {
  className?: string;
};

export default function ChatControlPanel({ className }: ChatControlPanelProps) {
  const [open, setOpen] = useState(false);

  const handleBlockedWordToolPanelClose = () => {
    setOpen(false);
  };
  const handleBlockedWordControlClick = () => {
    setOpen(!open);
  };

  return (
    <div className={`chat-control-panel-box ${className}`}>
      <ToolPanel
        open={open}
        onClose={handleBlockedWordToolPanelClose}
        slots={{
          title: "屏蔽词管理",
          content: (
            <>
              <BlockedWordForm />
              <BlcokedWordList />
            </>
          ),
        }}
      >
        <BlockedMessageSvg
          className="control-icon"
          onClick={handleBlockedWordControlClick}
        />
      </ToolPanel>
    </div>
  );
}
