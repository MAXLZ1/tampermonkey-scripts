import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ChatHistoryPanel from "./components/ChatHistoryPanel";
import { getComments, getRoomInfo } from "./apis";
import { extractDisplayComments } from "./utils";
import BlockedWordForm from "./components/BlockedWordForm";
import BlcokedWordList from "./components/BlockedWordList";
import { addComments } from "./stores";

function FrameSideApp() {
  return (
    <>
      <ChatHistoryPanel />
      <BlockedWordForm />
      <BlcokedWordList />
    </>
  );
}

function VideoBoxApp() {
  return <div></div>;
}

window.addEventListener("load", async () => {
  const frameSide = document.body.querySelector("[class^='Frame_side2']");
  const videoBox = document.body.querySelector("[id^='wbpv_video_']");

  const matches = window.location.href.match(/show\/(.*)$/);
  if (!matches?.[1]) return;

  const roomInfo = await getRoomInfo(matches[1]);

  if (!roomInfo) return;

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

  const updateComments = async () => {
    const latest = await getComments(mid, uid);
    const displayComments = extractDisplayComments(latest);

    addComments(displayComments);
  };

  setInterval(updateComments, Number(import.meta.env.VITE_REQUEST_GAP));
});
