import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ChatHistoryPanel from "./components/ChatHistoryPanel";
import { CommentsProvider } from "./components/CommentsContext";
import { getComments, getMid } from "./apis";
import { extractDisplayComments } from "./utils/commentsUtils";
import BlockedWordForm from "./components/BlockedWordForm";
import BlcokedWordList from "./components/BlockedWordList";

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
  return <div>test</div>;
}

window.addEventListener("load", async () => {
  const frameSide = document.querySelector(".Frame_side2_xRwuq");
  const videoBox = document.body.querySelector("#wbpv_video_459");

  const matches = window.location.href.match(/show\/(.*)$/);
  if (!matches?.[1]) return;

  const mid = await getMid(matches[1]);
  if (!mid) return;

  // 挂载 FrameSide
  if (frameSide) {
    ReactDOM.createRoot(frameSide).render(
      <React.StrictMode>
        <CommentsProvider>
          <FrameSideApp />
        </CommentsProvider>
      </React.StrictMode>,
    );
  }

  // 挂载 VideoBox
  if (videoBox) {
    const container = document.createElement("div");
    videoBox.append(container);
    ReactDOM.createRoot(container).render(
      <React.StrictMode>
        <CommentsProvider>
          <VideoBoxApp />
        </CommentsProvider>
      </React.StrictMode>,
    );
  }

  // 轮询更新 comments
  const updateComments = async () => {
    const latest = await getComments(mid, 3000);
    const displayComments = extractDisplayComments(latest);

    // 直接用 Context 更新
    const evt = new CustomEvent("update-comments", { detail: displayComments });
    window.dispatchEvent(evt);
  };

  const id = setInterval(updateComments, 3000);
  // setTimeout(() => clearInterval(id), 15000);
});
