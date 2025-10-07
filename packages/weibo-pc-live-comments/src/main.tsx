import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ChatHistoryPanel from "./components/ChatHistoryPanel";
import { getComments, getRoomInfo } from "./apis";
import { extractDisplayComments, injectCSS } from "./utils";
import { addComments } from "./stores";
import VideoComments from "./components/VideoComments";
import CommentSwitch from "./components/CommentsSwitch";
import { useCommentSwitch } from "./hooks";
import style from "./style/prettify.css?inline";
import VideoBackground from "./components/VideoBackground";

function FrameSideApp() {
  return (
    <>
      <ChatHistoryPanel />
    </>
  );
}

function VideoBoxApp() {
  const [checked] = useCommentSwitch();

  return (
    <>
      {checked && <VideoComments />}
      <VideoBackground />
    </>
  );
}

function VideoControlApp() {
  const [checked, setChecked] = useCommentSwitch();
  const handleClick = (checked: boolean) => setChecked(checked);

  return <CommentSwitch checked={checked} onClick={handleClick} />;
}

window.addEventListener("load", async () => {
  const frameSide = document.body.querySelector("[class^='Frame_side2']");
  const videoBox = document.body.querySelector("[id^='wbpv_video_']");
  const videoControlBar = document.body.querySelector(".wbpv-control-bar");

  const matches = window.location.href.match(/show\/(.*)$/);
  if (!matches?.[1]) return;

  const roomInfo = await getRoomInfo(matches[1]);

  if (!roomInfo || roomInfo.status !== 1) return;

  injectCSS(style);

  const {
    mid,
    user: { uid },
  } = roomInfo;

  // 挂载 FrameSide
  if (frameSide) {
    ReactDOM.createRoot(frameSide).render(
      <React.StrictMode>
        <FrameSideApp />
      </React.StrictMode>,
    );
  }

  // 挂载 VideoBox
  if (videoBox) {
    const container = document.createElement("div");
    videoBox.append(container);
    ReactDOM.createRoot(container).render(
      <React.StrictMode>
        <VideoBoxApp />
      </React.StrictMode>,
    );
  }

  // 弹幕开关
  if (videoControlBar) {
    const container = document.createElement("button");
    container.className = "danmu-switch";
    videoControlBar.insertBefore(
      container,
      videoControlBar.querySelector(".wbpv-fullscreen-control"),
    );
    ReactDOM.createRoot(container).render(
      <React.StrictMode>
        <VideoControlApp />
      </React.StrictMode>,
    );
  }

  const updateComments = async (isFirst?: boolean) => {
    const latest = await getComments(mid, uid, isFirst);
    const displayComments = extractDisplayComments(latest);

    addComments(displayComments);
  };

  function request() {
    setTimeout(() => {
      updateComments(true);
    }, 0);
    return setInterval(
      updateComments,
      Number(import.meta.env.VITE_REQUEST_GAP),
    );
  }

  let intervalId = request();

  const video = videoBox?.querySelector("video");

  if (video) {
    video.addEventListener("play", () => {
      intervalId = request();
    });
    video.addEventListener("pause", () => {
      clearInterval(intervalId);
    });
  }
});
