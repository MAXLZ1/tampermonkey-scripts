import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ChatHistoryPanel from "./components/ChatHistoryPanel";
import { getComments, getRoomInfo } from "./apis";
import {
  extractDisplayComments,
  launchLiveRoom,
  injectCSS,
  log,
} from "./utils";
import { addComments, globalSettingStore } from "./stores";
import VideoComments from "./components/VideoComments";
import CommentSwitch from "./components/CommentsSwitch";
import { useCommentSwitch } from "./hooks";
import style from "./style/prettify.css?inline";
import VideoBackground from "./components/VideoBackground";
import { MessageHolder } from "./components/WMessage/message";
import GlobalSetting from "./components/GlobalSetting";

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

function mountMessageHolder() {
  const div = document.createElement("div");
  document.body.appendChild(div);
  ReactDOM.createRoot(div).render(
    <React.StrictMode>
      <MessageHolder />
    </React.StrictMode>,
  );
}

window.addEventListener("load", async () => {
  mountMessageHolder();
  const frameSide = document.body.querySelector("[class^='Frame_side2']");
  const videoBox = document.body.querySelector("[id^='wbpv_video_']");
  const videoControlBar = document.body.querySelector(".wbpv-control-bar");

  const matches = window.location.href.match(/show\/(.*)$/);
  if (!matches?.[1]) return;

  const roomInfo = await getRoomInfo(matches[1]);

  if (roomInfo) {
    if (roomInfo.status !== 1) {
      const { user } = roomInfo;
      await launchLiveRoom(user);
      return;
    }
  } else {
    return;
  }

  injectCSS(style);

  // add global setting
  ReactDOM.createRoot(
    (() => {
      const div = document.createElement("div");
      document.body.appendChild(div);
      return div;
    })(),
  ).render(
    <React.StrictMode>
      <GlobalSetting />
    </React.StrictMode>,
  );

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
    let intervalId: number | undefined;
    let currentGap = globalSettingStore.getGlobalSetting().requestGap;

    const startRequest = (gap: number) => {
      if (intervalId !== undefined) clearInterval(intervalId);
      intervalId = setInterval(updateComments, gap * 1000);
      currentGap = gap;
      log(`request start with gap=${gap}s`);
    };

    updateComments(true);

    startRequest(currentGap);

    const unsubscribe = globalSettingStore.subscribe(
      ({ requestGap: newRequestGap }) => {
        if (newRequestGap !== currentGap) {
          startRequest(newRequestGap);
        }
      },
    );

    return () => {
      if (intervalId !== undefined) clearInterval(intervalId);
      unsubscribe?.();
      log("request stopped");
    };
  }

  let stop = request();
  const video = videoBox?.querySelector("video");

  if (video) {
    video.addEventListener("play", () => {
      stop();
      stop = request();
    });
    video.addEventListener("pause", () => {
      stop();
    });
  }
});
