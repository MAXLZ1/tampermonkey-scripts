// ==UserScript==
// @name         微博PC直播弹幕助手
// @namespace    npm/weibo-pc-live-comments
// @version      1.0.2
// @author       MAXLZ
// @description  在微博PC端生成弹幕。
// @icon         https://weibo.com/favicon.ico
// @match        https://weibo.com/l/wblive/p/show/*
// @require      https://cdn.jsdelivr.net/npm/umd-react@19.2.0/dist/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/umd-react@19.2.0/dist/react-dom.production.min.js
// @grant        none
// ==/UserScript==

(function (React, ReactDOM) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const React__namespace = _interopNamespaceDefault(React);

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production = {};
  /**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var hasRequiredReactJsxRuntime_production;
  function requireReactJsxRuntime_production() {
    if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
    hasRequiredReactJsxRuntime_production = 1;
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
    function jsxProd(type, config, maybeKey) {
      var key = null;
      void 0 !== maybeKey && (key = "" + maybeKey);
      void 0 !== config.key && (key = "" + config.key);
      if ("key" in config) {
        maybeKey = {};
        for (var propName in config)
          "key" !== propName && (maybeKey[propName] = config[propName]);
      } else maybeKey = config;
      config = maybeKey.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== config ? config : null,
        props: maybeKey
      };
    }
    reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
    reactJsxRuntime_production.jsx = jsxProd;
    reactJsxRuntime_production.jsxs = jsxProd;
    return reactJsxRuntime_production;
  }
  var hasRequiredJsxRuntime;
  function requireJsxRuntime() {
    if (hasRequiredJsxRuntime) return jsxRuntime.exports;
    hasRequiredJsxRuntime = 1;
    {
      jsxRuntime.exports = requireReactJsxRuntime_production();
    }
    return jsxRuntime.exports;
  }
  var jsxRuntimeExports = requireJsxRuntime();
  const indexCss$2 = ".chart-history-panel-box{position:relative;overflow:hidden;box-shadow:0 0 5px 4px #2828280d;border-radius:6px}.chart-history-panel{width:100%;min-height:450px;max-height:60vh;padding:10px;overflow-y:auto;box-sizing:border-box}.chart-history-panel-box .bottom-button{position:absolute;bottom:10px;left:0;right:0;margin:auto;width:100px;opacity:0;transform:translateY(20px);transition:all .3s ease;display:flex;align-items:center;justify-content:center;font-size:12px}.chart-history-panel-box .bottom-button .arrow-down{height:18px;width:18px}.chart-history-panel-box .bottom-button.visible{transform:translateY(0);opacity:.9}";
  importCSS(indexCss$2);
  function createLocalStorageStore(key, initialValue) {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify(initialValue));
    }
    const listeners = new Set();
    let lastSnapshot = initialValue;
    function subscribe(listener) {
      listeners.add(listener);
      const onStorage = (e) => {
        if (e.key === key) listeners.forEach((l) => l());
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    }
    function getSnapshot() {
      try {
        const item = localStorage.getItem(key);
        const parsed = item ? JSON.parse(item) : initialValue;
        if (typeof parsed === "object" && parsed !== null) {
          if (JSON.stringify(parsed) === JSON.stringify(lastSnapshot)) {
            return lastSnapshot;
          }
        } else if (parsed === lastSnapshot) {
          return lastSnapshot;
        }
        lastSnapshot = parsed;
        return parsed;
      } catch {
        return lastSnapshot;
      }
    }
    function setValue(value) {
      const newValue = value instanceof Function ? value(getSnapshot()) : value;
      localStorage.setItem(key, JSON.stringify(newValue));
      listeners.forEach((l) => l());
    }
    return {
      useStore: () => React.useSyncExternalStore(subscribe, getSnapshot),
      setValue,
      getSnapshot
    };
  }
  const blockedWordsStore = createLocalStorageStore(
    "blockedWords",
    []
  );
  function addBlockedWord(word) {
    blockedWordsStore.setValue((prev) => {
      const trimedWord = word.trim();
      if (!trimedWord) return prev;
      const newWords = Array.from( new Set([trimedWord, ...prev]));
      return newWords;
    });
  }
  function removeBlockedWord(word) {
    blockedWordsStore.setValue((prev) => prev.filter((w) => w !== word));
  }
  function clearBlockedWords() {
    blockedWordsStore.setValue([]);
  }
  function createCommentsStore() {
    let comments = [];
    const subscribers = new Set();
    const getComments2 = () => comments;
    const setComments = (newComments) => {
      comments = Array.from(
        new Map([...comments, ...newComments].map((c) => [c.id, c])).values()
      ).slice(-Number("100"));
      subscribers.forEach((sub) => sub());
    };
    const subscribe = (sub) => {
      subscribers.add(sub);
      return () => subscribers.delete(sub);
    };
    return { getComments: getComments2, setComments, subscribe };
  }
  const commentsStore = createCommentsStore();
  const addComments = (newComments) => {
    commentsStore.setComments(newComments);
  };
  function useBlockedWords() {
    const value = blockedWordsStore.useStore();
    return [value, { addBlockedWord, removeBlockedWord, clearBlockedWords }];
  }
  function useComments() {
    return React.useSyncExternalStore(
      commentsStore.subscribe,
      commentsStore.getComments
    );
  }
  function WButton({
    children,
    className,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      "button",
      {
        className: `woo-button-main woo-button-flat woo-button-primary woo-button-m woo-button-round ${className}`,
        ...props,
        children
      }
    );
  }
  const SvgArrowDownward = (props) => React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "24px", viewBox: "0 0 24 24", width: "24px", fill: "currentColor", ...props }, React__namespace.createElement("path", { d: "M0 0h24v24H0V0z", fill: "none" }), React__namespace.createElement("path", { d: "M11 5v11.17l-4.88-4.88c-.39-.39-1.03-.39-1.42 0-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0l6.59-6.59c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L13 16.17V5c0-.55-.45-1-1-1s-1 .45-1 1z" }));
  function ChatHistoryPanel() {
    const comments = useComments();
    const video = document.querySelector(".PlayInfo_boxout_3UBS0");
    const height = video ? `${video.getBoundingClientRect().height}px` : "50vh";
    const listRef = React.useRef(null);
    const [atBottom, setAtBottom] = React.useState(true);
    const handleScroll = React.useCallback(() => {
      if (!listRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      setAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }, []);
    React.useEffect(() => {
      if (atBottom && listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      }
    }, [comments, atBottom]);
    React.useEffect(() => {
      const el = listRef.current;
      if (!el) return;
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);
    const scrollToBottom = () => {
      if (listRef.current) {
        listRef.current.scrollTo({
          top: listRef.current.scrollHeight,
          behavior: "smooth"
        });
      }
    };
    return jsxRuntimeExports.jsxs("div", { className: "chart-history-panel-box", children: [
jsxRuntimeExports.jsx("div", { className: "chart-history-panel", style: { height }, ref: listRef, children: jsxRuntimeExports.jsx("div", { className: "wbpro-list", children: comments.map((comment) => jsxRuntimeExports.jsxs("div", { className: "text", children: [
jsxRuntimeExports.jsxs(
          "a",
          {
            href: `https://weibo.com/u/${comment.user.id}`,
            target: "_blank",
            rel: "noopener noreferrer",
            children: [
              comment.user.screen_name,
              ":"
            ]
          }
        ),
jsxRuntimeExports.jsx("span", { dangerouslySetInnerHTML: { __html: comment.text } })
      ] }, comment.id)) }) }),
jsxRuntimeExports.jsxs(
        WButton,
        {
          className: `bottom-button ${atBottom ? "" : "visible"}`,
          onClick: scrollToBottom,
          children: [
jsxRuntimeExports.jsx(SvgArrowDownward, { className: "arrow-down" }),
            "划到底部"
          ]
        }
      )
    ] });
  }
  function extractDisplayComments(comments) {
    const res = [];
    for (let i = 0; i < comments.length; i++) {
      if (!skipComment(comments[i])) {
        res.unshift(comments[i]);
      }
    }
    return res;
  }
  function skipComment(comment) {
    const blockedWords = blockedWordsStore.getSnapshot();
    return blockedWords.length > 0 && blockedWords.some((word) => {
      if (!word || !comment) return false;
      try {
        return new RegExp(word, "i").test(comment.text_raw);
      } catch (e) {
        return comment.text_raw.includes(word);
      }
    });
  }
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  async function getRoomInfo(liveId) {
    const res = await fetch(
      `https://weibo.com/l/!/2/wblive/room/show_pc_live.json?live_id=${liveId}`
    );
    if (res) {
      const { data } = await res.json();
      return data;
    }
    return null;
  }
  async function getComments(mid, uid) {
    await sleep(Math.random() * Number("3000"));
    const res = await fetch(
      `https://weibo.com/ajax/statuses/buildComments?flow=1&is_reload=1&id=${mid}&is_show_bulletin=2&is_mix=0&max_id=0&count=20&uid=${uid}&fetch_level=0&locale=zh-CN&expand_text=0`
    );
    if (res.ok) {
      const { data } = await res.json();
      return data;
    } else {
      return [];
    }
  }
  const indexCss$1 = ".blocked-word-form{margin-top:10px;display:flex;gap:10px}.blocked-word-form .blocked-word-input{flex:1}";
  importCSS(indexCss$1);
  function WInput({ className, ...props }) {
    return jsxRuntimeExports.jsx("div", { className: `woo-input-wrap ${className}`, children: jsxRuntimeExports.jsx("input", { className: "woo-input-main", ...props }) });
  }
  function BlockedWordForm() {
    const [blockedWord, setBlockedWord] = React.useState("");
    const [, { addBlockedWord: addBlockedWord2 }] = useBlockedWords();
    function handleBlockedWordChange(e) {
      setBlockedWord(e.target.value);
    }
    function handleSubmit(e) {
      e.preventDefault();
      if (!blockedWord.trim()) return;
      addBlockedWord2(blockedWord);
      setBlockedWord("");
    }
    return jsxRuntimeExports.jsxs("form", { className: "blocked-word-form", onSubmit: handleSubmit, children: [
jsxRuntimeExports.jsx(
        WInput,
        {
          className: "blocked-word-input",
          placeholder: "请输入关键字（支持正则表达式）",
          name: "filterWord",
          type: "text",
          value: blockedWord,
          onChange: handleBlockedWordChange
        }
      ),
jsxRuntimeExports.jsx(WButton, { type: "submit", children: "添加屏蔽词" })
    ] });
  }
  const indexCss = ".blocked-word-list{margin-top:10px;max-height:200px;overflow-y:auto;border:1px solid rgba(255,255,255,.2);border-radius:6px;padding:10px;box-sizing:border-box}.blocked-word-list .clear-blocked-words{width:100%;display:flex;justify-content:center;margin-top:10px}";
  importCSS(indexCss);
  const BlockedWordItemCss = ".blocked-word-item{display:inline-flex;justify-content:space-between;align-items:center;margin:0 6px 6px 0;padding:2px 6px 2px 12px;background:#ffa646;border-radius:99px;color:#fff;min-height:22px}.blocked-word-item>span{font-size:12px;flex:1}.blocked-word-item>.clear{margin-left:8px;cursor:pointer;font-size:12px;background-color:#8989894d;border-radius:50%;padding:2px;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;transform:scale(.85)}.blocked-word-item>.clear:hover{background-color:#89898966}";
  importCSS(BlockedWordItemCss);
  const SvgClose = (props) => React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "24px", viewBox: "0 0 24 24", width: "24px", fill: "currentColor", ...props }, React__namespace.createElement("path", { d: "M0 0h24v24H0V0z", fill: "none" }), React__namespace.createElement("path", { d: "M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" }));
  function BlcokedWordItem({
    word,
    onClear
  }) {
    const handleClick = () => {
      onClear && onClear(word);
    };
    return jsxRuntimeExports.jsxs("div", { className: "blocked-word-item", children: [
jsxRuntimeExports.jsx("span", { children: word }),
jsxRuntimeExports.jsx("div", { className: "clear", onClick: handleClick, children: jsxRuntimeExports.jsx(SvgClose, {}) })
    ] });
  }
  function BlcokedWordList() {
    const [blockedWords, { removeBlockedWord: removeBlockedWord2, clearBlockedWords: clearBlockedWords2 }] = useBlockedWords();
    const handleClear = (word) => {
      removeBlockedWord2(word);
    };
    const handleClearAll = () => {
      clearBlockedWords2();
    };
    return jsxRuntimeExports.jsxs("div", { className: "blocked-word-list", children: [
      blockedWords.map((word) => jsxRuntimeExports.jsx(
        BlcokedWordItem,
        {
          word,
          onClear: handleClear
        },
        word
      )),
      blockedWords.length > 0 && jsxRuntimeExports.jsx("div", { className: "clear-blocked-words", children: jsxRuntimeExports.jsx(WButton, { onClick: handleClearAll, children: "清空屏蔽词" }) })
    ] });
  }
  function FrameSideApp() {
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(ChatHistoryPanel, {}),
jsxRuntimeExports.jsx(BlockedWordForm, {}),
jsxRuntimeExports.jsx(BlcokedWordList, {})
    ] });
  }
  function VideoBoxApp() {
    return jsxRuntimeExports.jsx("div", {});
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
      user: { uid }
    } = roomInfo;
    if (frameSide) {
      ReactDOM.createRoot(frameSide).render(
jsxRuntimeExports.jsx(React.StrictMode, { children: jsxRuntimeExports.jsx(FrameSideApp, {}) })
      );
    }
    if (videoBox) {
      const container = document.createElement("div");
      videoBox.append(container);
      ReactDOM.createRoot(container).render(
jsxRuntimeExports.jsx(React.StrictMode, { children: jsxRuntimeExports.jsx(VideoBoxApp, {}) })
      );
    }
    const updateComments = async () => {
      const latest = await getComments(mid, uid);
      const displayComments = extractDisplayComments(latest);
      addComments(displayComments);
    };
    setInterval(updateComments, Number("3000"));
  });

})(React, ReactDOM);