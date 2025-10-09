import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import WMessage, { MessageType } from ".";
import "./MessageHolder.css";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

type Message = {
  id: number | string;
  content: React.ReactNode;
  type: MessageType;
  duration: number; //s
};

type MessageConfig = Partial<Message> & Pick<Message, "content">;

let addMessage: ((config: MessageConfig) => () => void) | null = null;

export function MessageHolder() {
  const [message, setMessage] = useState<Message[]>([]);
  const timers = React.useRef<Map<number | string, number>>(new Map());

  const deleteMessage = (msgId: string | number) => {
    setMessage((prev) =>
      prev.filter((n) => {
        timers.current.delete(msgId);
        return n.id !== msgId;
      }),
    );
  };

  useEffect(() => {
    addMessage = ({ id, type, duration, ...rest }: MessageConfig) => {
      const now = Date.now();
      const timeout = duration ?? 3;
      const msgId = id ?? now;
      const msgType = type ?? "info";

      setMessage((prev) => {
        const index = prev.findIndex((m) => m.id === msgId);

        if (index > -1) {
          const newMessage = [...prev];

          newMessage[index] = {
            ...newMessage[index],
            content: rest.content,
            type: msgType,
            ...(duration ? { duration } : {}),
          };
          return newMessage;
        }

        return [
          ...prev,
          { id: msgId, type: type ?? "info", duration: timeout, ...rest },
        ];
      });

      if (timers.current.has(msgId)) {
        clearTimeout(timers.current.get(msgId));
      }

      if (timeout > 0) {
        const t = setTimeout(() => {
          deleteMessage(msgId);
        }, timeout * 1000);
        timers.current.set(msgId, t);
      }

      return () => {
        deleteMessage(msgId);
      };
    };

    return () => {
      addMessage = null;
      timers.current.forEach((t) => clearTimeout(t));
      timers.current.clear();
    };
  }, []);

  return createPortal(
    <div className="message-container">
      <LayoutGroup>
        <AnimatePresence>
          {message.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              <WMessage type={m.type}>{m.content}</WMessage>
            </motion.div>
          ))}
        </AnimatePresence>
      </LayoutGroup>
    </div>,
    document.body,
  );
}

export const message = {
  open(config: MessageConfig) {
    return addMessage!(config);
  },
  info(config: MessageConfig) {
    return this.open({ ...config, type: "info" });
  },
  error(config: MessageConfig) {
    return this.open({ ...config, type: "error" });
  },
  success(config: MessageConfig) {
    return this.open({ ...config, type: "success" });
  },
  loading(config: MessageConfig) {
    return this.open({ ...config, type: "loading" });
  },
};
