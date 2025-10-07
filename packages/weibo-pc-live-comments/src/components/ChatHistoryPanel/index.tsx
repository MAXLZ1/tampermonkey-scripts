import "./index.css";
import { useComments, useIncrementalComments } from "../../hooks";
import { useEffect, useRef, useState, useCallback } from "react";
import WButton from "../WButton";
import ArrowDownSvg from "../../assets/arrow_downward.svg?react";
import ChatControlPanel from "../ChatControlPanel";
import CommentItem from "./CommentItem";

export default function ChatHistoryPanel() {
  const comments = useComments();
  const incrementalComments = useIncrementalComments();
  const [newCount, setNewCount] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);

  // 在底部时最后一次新增弹幕数量
  const lastSeenCount = useRef(0);

  const handleScroll = useCallback(() => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const isBottom = scrollTop + clientHeight >= scrollHeight - 10;

    // 判断是否接近底部（10px 以内算到底部）
    setAtBottom(isBottom);
  }, []);

  useEffect(() => {
    if (incrementalComments.length === 0) return;
    if (atBottom) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
      lastSeenCount.current = incrementalComments.length;
    } else {
      const delta = incrementalComments.length - lastSeenCount.current;
      if (delta >= 0) {
        setNewCount((prev) =>
          Math.min(
            prev + delta,
            Number(import.meta.env.VITE_MAX_COMMENTS_NUMBER),
          ),
        );
        lastSeenCount.current = 0; // 更新已计算数
      }
    }
  }, [incrementalComments, atBottom]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  return (
    <div className="chart-history-panel-box">
      <div className="chart-history-panel" ref={listRef}>
        <div className="comments-list">
          {comments.map((comment) => (
            <CommentItem comment={comment} key={comment.id} />
          ))}
        </div>
      </div>
      <ChatControlPanel className="chart-control-panel" />
      <WButton
        className={`bottom-button ${!atBottom && newCount > 0 ? "visible" : ""}`}
        onClick={scrollToBottom}
        onTransitionEnd={(e) => {
          if (e.propertyName === "opacity" && atBottom) {
            setNewCount(0);
          }
        }}
      >
        <ArrowDownSvg className="arrow-down" />
        {newCount}条新弹幕
      </WButton>
    </div>
  );
}
