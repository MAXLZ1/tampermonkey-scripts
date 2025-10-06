import { useIncrementalComments } from "../../hooks";
import { useEffect, useRef, useState } from "react";
import "./index.css";
import type { Comment } from "../../types/comment";

interface ActiveComment extends Comment {
  top: number;
  duration: number;
  delay: number;
  width: number;
  endX: number;
}

interface TrackInfo {
  track: number;
  duration: number;
  delay: number;
}

interface LastCommentInfo {
  // 弹幕完全消失的时间
  disappearTime: number;
  // 弹幕完整出现的时间（右边缘刚出现）
  appearTime: number;
  speed: number;
  width: number;
}

const maxTracks = Number(import.meta.env.VITE_MAX_TRACKS);
const trackHeight = Number(import.meta.env.VITE_TRACK_HEIGHT);
// 弹幕间安全间隔 单位px
const safeGap = Number(import.meta.env.VITE_COMMENTS_SAFE_GAP);
// 弹幕duration，单位ms
const fixDuration = Number(import.meta.env.VITE_COMMENT_DURATION);

function measureCommentWidth(text: string, container: HTMLElement) {
  const tempSpan = document.createElement("span");
  tempSpan.className = "video-comment";
  tempSpan.style.position = "absolute";
  tempSpan.style.whiteSpace = "nowrap";
  tempSpan.style.visibility = "hidden";
  tempSpan.innerHTML = text;
  container.appendChild(tempSpan);
  const commentWidth = tempSpan.offsetWidth;
  container.removeChild(tempSpan);
  return commentWidth;
}

export default function VideoComments() {
  const newComments = useIncrementalComments();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeComments, setActiveComments] = useState<ActiveComment[]>([]);
  const lastDisappearTimes = useRef<LastCommentInfo[]>(
    Array(maxTracks)
      .fill(0)
      .map(() => ({
        disappearTime: -1,
        appearTime: -1,
        speed: Number.MAX_SAFE_INTEGER,
        width: 0,
      })),
  );

  const containerWidthRef = useRef(0);

  function assignTrack(commentWidth: number): TrackInfo {
    const now = Date.now();
    const duration = fixDuration;
    const containerWidth = containerWidthRef.current;
    const speed = (containerWidth + commentWidth) / duration;
    const completeAppear = commentWidth / speed;

    let track = -1;
    let delay = 0;

    for (let i = 0; i < lastDisappearTimes.current.length; i++) {
      const last = lastDisappearTimes.current[i];
      // 上一条弹幕的右边界，安全间距 已经完全出现
      if (now >= last.appearTime + safeGap / last.speed) {
        track = i;
        break;
      }
    }

    // 如果没有立即可用轨道，选择最早能安全出现的
    if (track === -1) {
      let soonestTime = Number.MAX_VALUE;
      lastDisappearTimes.current.forEach((last, i) => {
        const readyTime = last.appearTime + safeGap / last.speed;
        if (readyTime < soonestTime) {
          soonestTime = readyTime;
          track = i;
        }
      });

      const last = lastDisappearTimes.current[track];

      // 防止弹幕追上前一个弹幕
      delay =
        last.disappearTime +
        safeGap / last.speed -
        now -
        containerWidth / speed;

      // 至少等到 readyTime
      if (delay < soonestTime - now) delay = soonestTime - now;
      if (delay < 0) delay = 0;
    } else {
      const last = lastDisappearTimes.current[track];
      if (last.speed < speed) {
        // 防止弹幕追上前一个弹幕
        delay =
          last.disappearTime +
          safeGap / last.speed -
          now -
          containerWidth / speed;
        if (delay < 0) delay = 0;
      }
    }

    const appearTime = now + delay + completeAppear;
    const disappearTime = now + delay + duration;

    lastDisappearTimes.current[track] = {
      speed,
      width: commentWidth,
      appearTime,
      disappearTime,
    };

    return { track, duration: duration / 1000, delay: delay / 1000 };
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    containerWidthRef.current = container.offsetWidth;

    const ro = new ResizeObserver(() => {
      const newWidth = container.offsetWidth;
      containerWidthRef.current = newWidth;

      lastDisappearTimes.current = Array(maxTracks)
        .fill(0)
        .map(() => ({
          disappearTime: -1,
          appearTime: -1,
          speed: Number.MAX_SAFE_INTEGER,
          width: 0,
        }));

      setActiveComments([]);
    });

    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || newComments.length === 0) return;

    const newActive: ActiveComment[] = newComments.map((c) => {
      const commentWidth = measureCommentWidth(c.text, container);
      const { track, duration, delay } = assignTrack(commentWidth);
      return {
        ...c,
        top: track * trackHeight + 20,
        duration,
        delay,
        width: commentWidth,
        endX: commentWidth + containerWidthRef.current + 50,
      };
    });

    setActiveComments((prev) => [...prev, ...newActive]);
  }, [newComments]);

  return (
    <div ref={containerRef} className="video-comments-box">
      {activeComments.map((c) => (
        <span
          key={c.id}
          className="video-comment"
          style={
            {
              top: `${c.top}px`,
              animation: `danmaku-move ${c.duration}s linear ${c.delay}s forwards`,
              "--end-x": `-${c.endX}px`,
            } as React.CSSProperties
          }
          onAnimationEnd={() =>
            setActiveComments((prev) => prev.filter((item) => item.id !== c.id))
          }
          dangerouslySetInnerHTML={{ __html: c.text }}
        ></span>
      ))}
    </div>
  );
}
