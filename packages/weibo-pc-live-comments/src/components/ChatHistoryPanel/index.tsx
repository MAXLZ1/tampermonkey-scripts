import "./index.css";
import { useComments } from "../../hooks";
import { useEffect, useRef, useState, useCallback } from "react";
import WButton from "../WButton";
import ArrowDownSvg from "../../assets/arrow_downward.svg?react";

export default function ChatHistoryPanel() {
  const comments = useComments();
  const video = document.querySelector(".PlayInfo_boxout_3UBS0");
  const height = video ? `${video.getBoundingClientRect().height}px` : "50vh";
  const listRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);

  const handleScroll = useCallback(() => {
    if (!listRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    // 判断是否接近底部（10px 以内算到底部）
    setAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
  }, []);

  useEffect(() => {
    if (atBottom && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [comments, atBottom]);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="chart-history-panel-box">
      <div className="chart-history-panel" style={{ height }} ref={listRef}>
        <div className="wbpro-list">
          {comments.map((comment) => (
            <div className="text" key={comment.id}>
              <a
                href={`https://weibo.com/u/${comment.user.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {comment.user.screen_name}:
              </a>
              <span dangerouslySetInnerHTML={{ __html: comment.text }}></span>
            </div>
          ))}
        </div>
      </div>
      <WButton
        className={`bottom-button ${atBottom ? "" : "visible"}`}
        onClick={scrollToBottom}
      >
        <ArrowDownSvg className="arrow-down" />
        划到底部
      </WButton>
    </div>
  );
}
