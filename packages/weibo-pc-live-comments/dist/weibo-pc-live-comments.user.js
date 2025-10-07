// ==UserScript==
// @name         微博PC直播弹幕助手
// @namespace    npm/weibo-pc-live-comments
// @version      1.2.0
// @author       MAXLZ
// @description  在微博PC端生成弹幕。
// @license      MIT
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
  const indexCss$7 = ".danmu-switch{display:flex;align-items:center;justify-self:center;cursor:pointer;margin-right:24px;padding-top:2px}.wbp-video.wbpv-fullscreen .danmu-switch{height:70px;padding-bottom:2px;padding-top:0;margin-right:40px}.danmu-switch:hover{color:#ff8200}";
  importCSS(indexCss$7);
  const indexCss$6 = ".chart-history-panel-box{position:relative;overflow:hidden;box-shadow:0 0 5px 4px #2828280d;border-radius:6px;height:calc(100vh - 10px - var(--weibo-top-nav-height) - 115px - 30px);border:1px solid rgba(255,255,255,.4)}.chart-history-panel{width:100%;min-height:450px;height:calc(100% - 35px);padding:10px;overflow-y:auto;box-sizing:border-box}.chart-history-panel .comments-list{width:100%;line-height:22px;font-size:13px}.chart-history-panel-box .chart-control-panel{height:35px}.chart-history-panel-box .bottom-button{position:absolute;bottom:45px;left:0;right:0;margin:auto;width:110px;opacity:0;transform:translateY(10px);transition:all .3s ease;display:flex;align-items:center;justify-content:center;font-size:12px;padding:8px 4px;z-index:1}.chart-history-panel-box .bottom-button .arrow-down{height:16px;width:16px;margin-right:4px}.chart-history-panel-box .bottom-button.visible{transform:translateY(0);opacity:.9}";
  importCSS(indexCss$6);
  function createLocalStorageStore(key, initialValue) {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify(initialValue));
    }
    const listeners = new Set();
    let lastSnapshot = read();
    function read() {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch {
        return initialValue;
      }
    }
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
      const next = read();
      if (JSON.stringify(next) !== JSON.stringify(lastSnapshot)) {
        lastSnapshot = next;
      }
      return lastSnapshot;
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
    `${"weibo-pc-live-comments"}-block-words"`,
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
      const prevIds = new Set(comments.map((c) => c.id));
      const merged = Array.from(
        new Map([...comments, ...newComments].map((c) => [c.id, c])).values()
      ).slice(-Number("200"));
      const added = merged.filter((c) => !prevIds.has(c.id));
      if (added.length === 0) return;
      comments = merged;
      subscribers.forEach((sub) => sub(added));
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
  const commentSwitchStore = createLocalStorageStore(
    `${"weibo-pc-live-comments"}-video-comments-enabled"`,
    true
  );
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
  function useIncrementalComments() {
    const [added, setAdded] = React.useState([]);
    React.useEffect(() => {
      const unsubscribe = commentsStore.subscribe((newAdded) => {
        setAdded(newAdded);
      });
      return () => {
        unsubscribe();
      };
    }, []);
    return added;
  }
  function useCommentSwitch() {
    return [commentSwitchStore.useStore(), commentSwitchStore.setValue];
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
  const indexCss$5 = ".chat-control-panel-box{display:flex;align-items:center;justify-content:flex-start;padding:0 10px;color:#929292;gap:10px;position:relative}.chat-control-panel-box .control-icon{height:26px;width:26px;cursor:pointer}.chat-control-panel-box .control-icon:hover{color:var(--w-brand)}";
  importCSS(indexCss$5);
  const SvgBlockedMessage = (props) => React__namespace.createElement("svg", { t: 1759738789170, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1306, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M478.0032 753.1008H165.2736c-19.0464-0.01024-34.47808-15.33952-34.5088-34.26304l0.1024-516.83328h658.70848c18.96448 0 34.31424 15.53408 34.31424 34.58048v174.22336c0 19.01568 15.5136 34.43712 34.6624 34.43712 19.13856 0 34.65216-15.42144 34.65216-34.43712V236.58496C893.2864 179.6096 846.9504 133.3248 789.61664 133.12H130.85696C92.63104 133.05856 61.57312 163.77856 61.44 201.76896v517.0688c0.1024 56.9344 46.53056 103.07584 103.8336 103.15776h312.7296c19.13856 0 34.65216-15.42144 34.65216-34.44736 0-19.02592-15.5136-34.44736-34.65216-34.44736", fill: "currentColor", "p-id": 1307 }), React__namespace.createElement("path", { d: "M373.37088 477.55264H234.73152c-19.1488 0-34.6624 15.42144-34.6624 34.44736 0 19.02592 15.52384 34.44736 34.6624 34.44736h138.63936c19.13856 0 34.65216-15.42144 34.65216-34.44736 0-19.02592-15.5136-34.44736-34.65216-34.44736m0 137.7792H234.73152c-19.1488 0-34.6624 15.42144-34.6624 34.44736 0 19.01568 15.52384 34.43712 34.6624 34.43712h138.63936c19.13856 0 34.65216-15.42144 34.65216-34.43712 0-19.02592-15.5136-34.44736-34.65216-34.44736M512 339.7632H234.73152c-19.1488 0-34.6624 15.43168-34.6624 34.44736 0 19.02592 15.52384 34.44736 34.6624 34.44736H512c19.1488 0 34.6624-15.42144 34.6624-34.44736 0-19.01568-15.52384-34.43712-34.6624-34.43712m242.60608 482.2016c-76.45184 0-138.62912-61.78816-138.62912-137.76896 0-25.48736 7.45472-49.0496 19.65056-69.53984l188.95872 187.79136a137.44128 137.44128 0 0 1-69.98016 19.52768m0-275.5584c76.46208 0 138.63936 61.7984 138.63936 137.7792 0 25.4976-7.45472 49.0496-19.6608 69.53984L684.6464 565.97504a137.44128 137.44128 0 0 1 69.96992-19.52768m0-68.89472c-114.688 0-207.94368 92.69248-207.94368 206.66368C546.6624 798.18752 639.92832 890.88 754.60608 890.88 869.29408 890.88 962.56 798.18752 962.56 684.21632c0-113.9712-93.26592-206.66368-207.95392-206.66368", fill: "currentColor", "p-id": 1308 }));
  const ToolPanelCss = ".tool-panel-main{box-sizing:border-box;position:absolute;bottom:calc(100% - 10px);left:-1px;right:-1px;background-color:#fff;transition:all .3s ease;opacity:0;pointer-events:none;z-index:99}.tool-panel-main.open{bottom:100%;opacity:1;pointer-events:initial}.tool-panel-main .tool-panel-title{background-color:#eae6e6;font-size:14px;color:#333;padding:10px;border-radius:6px 6px 0 0;display:flex;align-items:center;justify-content:space-between}.tool-panel-main .tool-panel-title .close-icon{width:16px;height:16px;cursor:pointer}.tool-panel-main .tool-panel-title .close-icon:hover{color:#979797}.tool-panel-main .tool-panel-content{padding:10px}";
  importCSS(ToolPanelCss);
  const SvgClose = (props) => React__namespace.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", height: "24px", viewBox: "0 0 24 24", width: "24px", fill: "currentColor", ...props }, React__namespace.createElement("path", { d: "M0 0h24v24H0V0z", fill: "none" }), React__namespace.createElement("path", { d: "M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" }));
  function ToolPanel({
    children,
    open,
    onClose,
    slots: { title, content }
  }) {
    const handleClose = () => {
      onClose && onClose();
    };
    return jsxRuntimeExports.jsxs("div", { className: "tool-panel-box", children: [
      children,
jsxRuntimeExports.jsxs("div", { className: `tool-panel-main ${open ? "open" : ""}`, children: [
jsxRuntimeExports.jsxs("div", { className: "tool-panel-title", children: [
jsxRuntimeExports.jsx("span", { children: title }),
jsxRuntimeExports.jsx(SvgClose, { className: "close-icon", onClick: handleClose })
        ] }),
jsxRuntimeExports.jsx("div", { className: "tool-panel-content", children: content })
      ] })
    ] });
  }
  const indexCss$4 = ".blocked-word-form{margin-top:10px;display:flex;gap:10px}.blocked-word-form .blocked-word-input{flex:1}";
  importCSS(indexCss$4);
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
jsxRuntimeExports.jsx(WButton, { type: "submit", className: "woo-button-s", children: "添加屏蔽词" })
    ] });
  }
  const indexCss$3 = ".blocked-word-list{margin-top:10px;max-height:200px;overflow-y:auto;border:1px solid rgba(255,255,255,.2);border-radius:6px;box-sizing:border-box;padding:0;font-size:12px}.clear-blocked-words{width:100%;text-align:center;margin-top:10px;font-size:14px}.clear-blocked-words a{cursor:pointer}.clear-blocked-words a:hover{color:var(--w-brand);text-decoration:underline}.no-blocked-words{text-align:center;color:#929292;padding:20px 0;font-size:14px}";
  importCSS(indexCss$3);
  const BlockedWordItemCss = ".blocked-word-item{display:flex;justify-content:space-between;align-items:center;padding:4px 8px;border-radius:4px}.blocked-word-item:hover{background-color:#8989891a}.blocked-word-item .blocked-word-item-left{display:flex;align-items:center;gap:10px;flex:1}.blocked-word-item .blocked-word-item-left .blocked-word-text{white-space:nowrap;text-overflow:ellipsis;overflow:hidden;max-width:250px}.blocked-word-item>.clear{margin-left:8px;cursor:pointer;font-size:12px;padding:2px;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center}.blocked-word-item>.clear:hover{color:var(--w-brand)}@media screen and (max-width: 1319px){.blocked-word-item .blocked-word-item-left .blocked-word-text{max-width:200px}}";
  importCSS(BlockedWordItemCss);
  const SvgTrash = (props) => React__namespace.createElement("svg", { t: 1759756521143, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1701, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M640 192h192v64h-64v576l-64 64H256l-64-64V256H128V192h192V128a64 64 0 0 1 64-64h192a64 64 0 0 1 64 64v64zM576 128H384v64h192V128zM256 832h448V256H256v576z m128-512H320v448h64V320z m64 0h64v448H448V320z m128 0h64v448H576V320z", fill: "currentColor", "p-id": 1702 }));
  function BlcokedWordItem({
    word,
    onClear,
    index
  }) {
    const handleClick = () => {
      onClear && onClear(word);
    };
    return jsxRuntimeExports.jsxs("li", { className: "blocked-word-item", children: [
jsxRuntimeExports.jsxs("div", { className: "blocked-word-item-left", children: [
jsxRuntimeExports.jsxs("span", { children: [
          index,
          "."
        ] }),
jsxRuntimeExports.jsx("span", { className: "blocked-word-text", children: word })
      ] }),
jsxRuntimeExports.jsx(SvgTrash, { className: "clear", onClick: handleClick })
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
    return blockedWords.length > 0 ? jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx("ul", { className: "blocked-word-list", children: blockedWords.map((word, index) => jsxRuntimeExports.jsx(
        BlcokedWordItem,
        {
          word,
          index: index + 1,
          onClear: handleClear
        },
        word
      )) }),
jsxRuntimeExports.jsx("div", { className: "clear-blocked-words", children: jsxRuntimeExports.jsx("a", { onClick: handleClearAll, children: "清空屏蔽词" }) })
    ] }) : jsxRuntimeExports.jsx("div", { className: "no-blocked-words", children: "当前暂未设置屏蔽词" });
  }
  function ChatControlPanel({ className }) {
    const [open, setOpen] = React.useState(false);
    const handleBlockedWordToolPanelClose = () => {
      setOpen(false);
    };
    const handleBlockedWordControlClick = () => {
      setOpen(!open);
    };
    return jsxRuntimeExports.jsx("div", { className: `chat-control-panel-box ${className}`, children: jsxRuntimeExports.jsx(
      ToolPanel,
      {
        open,
        onClose: handleBlockedWordToolPanelClose,
        slots: {
          title: "屏蔽词管理",
          content: jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(BlockedWordForm, {}),
jsxRuntimeExports.jsx(BlcokedWordList, {})
          ] })
        },
        children: jsxRuntimeExports.jsx(
          SvgBlockedMessage,
          {
            className: "control-icon",
            onClick: handleBlockedWordControlClick
          }
        )
      }
    ) });
  }
  const CommentItemCss = ".comment-item{word-wrap:break-word;word-break:break-word;white-space:pre-wrap;margin:2px 0;padding:4px;border-radius:4px}.comment-item:hover{background-color:#adadad4d}.comment-item .avatar{width:24px;border-radius:50%;margin-right:4px;vertical-align:middle}.comment-item .fans-icon{height:14px;vertical-align:middle;margin-right:4px}.comment-item .comment-user{color:var(--w-alink);text-decoration:none;cursor:pointer;margin-right:2px}.comment-item .comment-text img{width:16px;height:16px;vertical-align:text-bottom}.comment-item .comment-text a{color:var(--w-alink);text-decoration:none;cursor:pointer}";
  importCSS(CommentItemCss);
  function CommentItem({ comment }) {
    const {
      user: {
        fansIcon: { icon_url },
        avatar_large
      }
    } = comment;
    return jsxRuntimeExports.jsxs("div", { className: "comment-item", children: [
      avatar_large && jsxRuntimeExports.jsx("img", { src: avatar_large, className: "avatar", alt: "" }),
jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://weibo.com/u/${comment.user.id}`,
          className: "comment-user",
          target: "_blank",
          rel: "noopener noreferrer",
          children: comment.user.screen_name
        }
      ),
      icon_url && jsxRuntimeExports.jsx("img", { src: icon_url, className: "fans-icon", alt: "" }),
      ":",
jsxRuntimeExports.jsx(
        "span",
        {
          dangerouslySetInnerHTML: { __html: comment.text },
          className: "comment-text"
        }
      )
    ] }, comment.id);
  }
  function ChatHistoryPanel() {
    const comments = useComments();
    const incrementalComments = useIncrementalComments();
    const [newCount, setNewCount] = React.useState(0);
    const listRef = React.useRef(null);
    const [atBottom, setAtBottom] = React.useState(true);
    const lastSeenCount = React.useRef(0);
    const handleScroll = React.useCallback(() => {
      if (!listRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setAtBottom(isBottom);
    }, []);
    React.useEffect(() => {
      if (incrementalComments.length === 0) return;
      if (atBottom) {
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
        lastSeenCount.current = incrementalComments.length;
      } else {
        const delta = incrementalComments.length - lastSeenCount.current;
        if (delta >= 0) {
          setNewCount(
            (prev) => Math.min(
              prev + delta,
              Number("200")
            )
          );
          lastSeenCount.current = 0;
        }
      }
    }, [incrementalComments, atBottom]);
    React.useEffect(() => {
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
    return jsxRuntimeExports.jsxs("div", { className: "chart-history-panel-box", children: [
jsxRuntimeExports.jsx("div", { className: "chart-history-panel", ref: listRef, children: jsxRuntimeExports.jsx("div", { className: "comments-list", children: comments.map((comment) => jsxRuntimeExports.jsx(CommentItem, { comment }, comment.id)) }) }),
jsxRuntimeExports.jsx(ChatControlPanel, { className: "chart-control-panel" }),
jsxRuntimeExports.jsxs(
        WButton,
        {
          className: `bottom-button ${!atBottom && newCount > 0 ? "visible" : ""}`,
          onClick: scrollToBottom,
          onTransitionEnd: (e) => {
            if (e.propertyName === "opacity" && atBottom) {
              setNewCount(0);
            }
          },
          children: [
jsxRuntimeExports.jsx(SvgArrowDownward, { className: "arrow-down" }),
            newCount,
            "条新弹幕"
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
  function injectCSS(css) {
    const style2 = document.createElement("style");
    style2.textContent = css;
    document.head.appendChild(style2);
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
  async function getComments(mid, uid, isFirst) {
    if (!isFirst) {
      await sleep(Math.random() * Number("3000"));
    }
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
  const indexCss$2 = ".video-comments-box{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;color:#fff;overflow:hidden}.video-comments-box>.video-comment{position:absolute;white-space:nowrap;font-size:16px;--stroke-color: rgba(0, 0, 0, .8);text-shadow:1px 0 var(--stroke-color),0 1px var(--stroke-color),-1px 0 var(--stroke-color),0 -1px var(--stroke-color);left:100%;opacity:.6;will-change:transform}.video-comments-box>.video-comment a{color:#fff}.video-comments-box>.video-comment img{height:16px;width:16x;max-width:16px;max-height:16px;vertical-align:-4px}.video-comments-box>span img+img{margin-left:2px}@keyframes danmaku-move{0%{transform:translateZ(0)}to{transform:translate3d(var(--end-x),0,0)}}";
  importCSS(indexCss$2);
  const maxTracks = Number("10");
  const trackHeight = Number("30");
  const safeGap = Number("100");
  const fixDuration = Number("8000");
  function measureCommentWidth(text, container) {
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
  function VideoComments() {
    const newComments = useIncrementalComments();
    const containerRef = React.useRef(null);
    const [activeComments, setActiveComments] = React.useState([]);
    const lastDisappearTimes = React.useRef(
      Array(maxTracks).fill(0).map(() => ({
        disappearTime: -1,
        appearTime: -1,
        speed: Number.MAX_SAFE_INTEGER,
        width: 0
      }))
    );
    const containerWidthRef = React.useRef(0);
    function assignTrack(commentWidth) {
      const now = Date.now();
      const duration = fixDuration;
      const containerWidth = containerWidthRef.current;
      const speed = (containerWidth + commentWidth) / duration;
      const completeAppear = commentWidth / speed;
      let track = -1;
      let delay = 0;
      for (let i = 0; i < lastDisappearTimes.current.length; i++) {
        const last = lastDisappearTimes.current[i];
        if (now >= last.appearTime + safeGap / last.speed) {
          track = i;
          break;
        }
      }
      if (track === -1) {
        let soonestTime = Number.MAX_VALUE;
        lastDisappearTimes.current.forEach((last2, i) => {
          const readyTime = last2.appearTime + safeGap / last2.speed;
          if (readyTime < soonestTime) {
            soonestTime = readyTime;
            track = i;
          }
        });
        const last = lastDisappearTimes.current[track];
        delay = last.disappearTime + safeGap / last.speed - now - containerWidth / speed;
        if (delay < soonestTime - now) delay = soonestTime - now;
        if (delay < 0) delay = 0;
      } else {
        const last = lastDisappearTimes.current[track];
        if (last.speed < speed) {
          delay = last.disappearTime + safeGap / last.speed - now - containerWidth / speed;
          if (delay < 0) delay = 0;
        }
      }
      const appearTime = now + delay + completeAppear;
      const disappearTime = now + delay + duration;
      lastDisappearTimes.current[track] = {
        speed,
        width: commentWidth,
        appearTime,
        disappearTime
      };
      return { track, duration: duration / 1e3, delay: delay / 1e3 };
    }
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      containerWidthRef.current = container.offsetWidth;
      const ro = new ResizeObserver(() => {
        const newWidth = container.offsetWidth;
        containerWidthRef.current = newWidth;
        lastDisappearTimes.current = Array(maxTracks).fill(0).map(() => ({
          disappearTime: -1,
          appearTime: -1,
          speed: Number.MAX_SAFE_INTEGER,
          width: 0
        }));
        setActiveComments([]);
      });
      ro.observe(container);
      return () => ro.disconnect();
    }, []);
    React.useEffect(() => {
      const container = containerRef.current;
      if (!container || newComments.length === 0) return;
      const newActive = newComments.map((c) => {
        const commentWidth = measureCommentWidth(c.text, container);
        const { track, duration, delay } = assignTrack(commentWidth);
        return {
          ...c,
          top: track * trackHeight + 20,
          duration,
          delay,
          width: commentWidth,
          endX: commentWidth + containerWidthRef.current + 50
        };
      });
      setActiveComments((prev) => [...prev, ...newActive]);
    }, [newComments]);
    return jsxRuntimeExports.jsx("div", { ref: containerRef, className: "video-comments-box", children: activeComments.map((c) => jsxRuntimeExports.jsx(
      "span",
      {
        className: "video-comment",
        style: {
          top: `${c.top}px`,
          animation: `danmaku-move ${c.duration}s linear ${c.delay}s forwards`,
          "--end-x": `-${c.endX}px`
        },
        onAnimationEnd: () => setActiveComments((prev) => prev.filter((item) => item.id !== c.id)),
        dangerouslySetInnerHTML: { __html: c.text }
      },
      c.id
    )) });
  }
  const indexCss$1 = ".danmu-icon{height:24px;width:24px}.wbpv-fullscreen.wbp-video .danmu-icon{width:34px;height:34px}";
  importCSS(indexCss$1);
  const SvgDanmuClose = (props) => React__namespace.createElement("svg", { t: 1759563176201, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1275, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M663.04 457.6H610.133333v37.973333h52.906667v-37.973333z m-100.266667 0h-50.346666v37.973333h50.346666v-37.973333z m0 77.226667h-50.346666v35.84h50.346666v-35.84z m100.266667 0H610.133333v35.84h52.906667v-35.84z m-25.6-193.28l45.653333 16.213333c-9.386667 22.186667-20.053333 41.813333-31.573333 59.306667h53.76v194.133333h-95.573333v35.413333h41.813333l-14.08 45.226667h-27.733333l-0.426667-0.426667-113.92 0.426667h-43.52v-45.226667h110.08v-35.413333h-93.44v-194.133333h55.466667a362.24 362.24 0 0 0-34.56-57.173334l43.946666-14.933333c12.8 18.346667 24.746667 37.973333 34.133334 58.88l-29.013334 12.8h64c13.653333-23.04 24.746667-48.64 34.986667-75.093333z m-198.826667 20.48v142.08H355.413333l-6.4 62.293333h92.586667c0 79.36-2.986667 132.266667-7.253333 159.146667-5.546667 26.88-29.013333 41.386667-71.253334 44.373333-11.946667 0-23.893333-0.853333-37.12-1.706667l-12.373333-44.8c11.946667 1.28 25.173333 2.133333 37.973333 2.133334 23.04 0 36.266667-7.253333 39.253334-22.186667 3.413333-14.933333 5.12-46.506667 5.12-95.573333H299.52l12.8-144.64h78.08v-59.733334H303.786667v-40.96h134.826666v-0.426666z", fill: "currentColor", "p-id": 1276 }), React__namespace.createElement("path", { d: "M775.424 212.693333a170.666667 170.666667 0 0 1 170.496 162.133334l0.170667 8.533333v74.24a42.666667 42.666667 0 0 1-85.034667 4.992l-0.298667-4.992v-74.24a85.333333 85.333333 0 0 0-78.933333-85.077333l-6.4-0.256H246.954667a85.333333 85.333333 0 0 0-85.12 78.976l-0.213334 6.4v400.597333a85.333333 85.333333 0 0 0 78.933334 85.12l6.4 0.213333h281.770666a42.666667 42.666667 0 0 1 4.992 85.034667l-4.992 0.298667H246.954667a170.666667 170.666667 0 0 1-170.453334-162.133334l-0.213333-8.533333v-400.64a170.666667 170.666667 0 0 1 162.133333-170.453333l8.533334-0.213334h528.469333z", fill: "currentColor", "p-id": 1277 }), React__namespace.createElement("path", { d: "M300.842667 97.194667a42.666667 42.666667 0 0 1 56.32-3.541334l4.010666 3.541334 128 128a42.666667 42.666667 0 0 1-56.32 63.914666l-4.010666-3.541333-128-128a42.666667 42.666667 0 0 1 0-60.373333z", fill: "currentColor", "p-id": 1278 }), React__namespace.createElement("path", { d: "M702.506667 97.194667a42.666667 42.666667 0 0 0-56.32-3.541334l-4.010667 3.541334-128 128a42.666667 42.666667 0 0 0 56.32 63.914666l4.010667-3.541333 128-128a42.666667 42.666667 0 0 0 0-60.373333z", fill: "currentColor", "p-id": 1279 }), React__namespace.createElement("path", { d: "M768 512a213.333333 213.333333 0 1 0 0 426.666667 213.333333 213.333333 0 0 0 0-426.666667z m0 85.333333a128 128 0 1 1 0 256 128 128 0 0 1 0-256z", fill: "currentColor", "p-id": 1280 }), React__namespace.createElement("path", { d: "M848.512 588.245333a42.666667 42.666667 0 0 1 62.592 57.728l-3.626667 3.925334-214.954666 205.610666a42.666667 42.666667 0 0 1-62.592-57.728l3.626666-3.925333 214.954667-205.653333z", fill: "currentColor", "p-id": 1281 }));
  const SvgDanmuOpen = (props) => React__namespace.createElement("svg", { t: 1759563191722, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1440, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M663.04 457.6H610.133333v37.973333h52.906667v-37.973333z m-100.266667 0h-50.346666v37.973333h50.346666v-37.973333z m0 77.226667h-50.346666v35.84h50.346666v-35.84z m100.266667 0H610.133333v35.84h52.906667v-35.84z m-25.6-193.28l45.653333 16.213333c-9.386667 22.186667-20.053333 41.813333-31.573333 59.306667h53.76v194.133333h-95.573333v35.413333h113.493333v44.8l-0.426667 0.426667h-113.066666l-0.426667-0.426667c-29.013333-31.146667-77.653333-33.28-109.226667-4.266666l-4.693333 4.693333h-43.52v-45.226667h110.08v-35.413333h-93.44v-194.133333h55.466667a362.24 362.24 0 0 0-34.56-57.173334l43.946666-14.933333c12.8 18.346667 24.746667 37.973333 34.133334 58.88l-29.013334 12.8h64c13.653333-23.04 24.746667-48.64 34.986667-75.093333z m-198.826667 20.48v142.08H355.413333l-6.4 62.293333h92.586667c0 79.36-2.986667 132.266667-7.253333 159.146667-5.546667 26.88-29.013333 41.386667-71.253334 44.373333-11.946667 0-23.893333-0.853333-37.12-1.706667l-12.373333-44.8c11.946667 1.28 25.173333 2.133333 37.973333 2.133334 23.04 0 36.266667-7.253333 39.253334-22.186667 3.413333-14.933333 5.12-46.506667 5.12-95.573333H299.52l12.8-144.64h78.08v-59.733334H303.786667v-40.96h134.826666v-0.426666z", fill: "currentColor", "p-id": 1441 }), React__namespace.createElement("path", { d: "M775.424 212.693333a170.666667 170.666667 0 0 1 170.496 162.133334l0.170667 8.533333v106.666667a42.666667 42.666667 0 0 1-85.034667 4.949333l-0.298667-4.992V383.36a85.333333 85.333333 0 0 0-78.933333-85.077333l-6.4-0.256H246.954667a85.333333 85.333333 0 0 0-85.12 78.976l-0.213334 6.4v400.597333a85.333333 85.333333 0 0 0 78.933334 85.12l6.4 0.213333h281.770666a42.666667 42.666667 0 0 1 4.992 85.034667l-4.992 0.298667H246.954667a170.666667 170.666667 0 0 1-170.453334-162.133334l-0.213333-8.533333v-400.64a170.666667 170.666667 0 0 1 162.133333-170.453333l8.533334-0.213334h528.469333z", fill: "currentColor", "p-id": 1442 }), React__namespace.createElement("path", { d: "M300.842667 97.194667a42.666667 42.666667 0 0 1 56.32-3.541334l4.010666 3.541334 128 128a42.666667 42.666667 0 0 1-56.32 63.914666l-4.010666-3.541333-128-128a42.666667 42.666667 0 0 1 0-60.373333z", fill: "currentColor", "p-id": 1443 }), React__namespace.createElement("path", { d: "M702.506667 97.194667a42.666667 42.666667 0 0 0-56.32-3.541334l-4.010667 3.541334-128 128a42.666667 42.666667 0 0 0 56.32 63.914666l4.010667-3.541333 128-128a42.666667 42.666667 0 0 0 0-60.373333z", fill: "currentColor", "p-id": 1444 }), React__namespace.createElement("path", { d: "M872.362667 610.773333a42.666667 42.666667 0 0 1 65.578666 54.314667l-3.413333 4.138667-230.058667 244.608a42.666667 42.666667 0 0 1-57.685333 4.096l-4.096-3.712-110.634667-114.688a42.666667 42.666667 0 0 1 57.472-62.848l3.968 3.626666 79.488 82.389334 199.381334-211.925334z", fill: "#ff8200", "p-id": 1445 }));
  function CommentSwitch({
    checked,
    onClick
  }) {
    const handleClick = () => {
      onClick?.(!checked);
    };
    return jsxRuntimeExports.jsx("div", { onClick: handleClick, children: checked ? jsxRuntimeExports.jsx(SvgDanmuOpen, { className: "danmu-icon" }) : jsxRuntimeExports.jsx(SvgDanmuClose, { className: "danmu-icon" }) });
  }
  const style = "div[class*=Frame_content]{width:100%;padding:0 80px;box-sizing:border-box;gap:20px}div[class^=Frame_side2]{width:400px}div[class^=Frame_main]{width:calc(100% - 420px)}div[class*=Frame_wrap]{height:calc(100% - var(--weibo-top-nav-height));min-height:calc(100% - var(--weibo-top-nav-height))}div[class^=PlayInfo_boxin]{overflow:hidden;padding-bottom:calc(100vh - 10px - var(--weibo-top-nav-height) - 115px - 50px - 30px)}.wbpv-poster{display:block;filter:blur(35px);z-index:0}div[class^=Detail_wrap]~*{display:none}@media screen and (max-width: 1319px){div[class*=Frame_content]{padding:0 50px}div[class^=Frame_side2]{width:350px}div[class^=Frame_main]{width:calc(100% - 370px)}}";
  const indexCss = ".video-background{position:absolute;left:0;top:0;height:100%;width:100%;z-index:0;filter:blur(35px);background-size:cover}";
  importCSS(indexCss);
  function VideoBackground() {
    const [url, setUrl] = React.useState("");
    React.useEffect(() => {
      const posterDom = document.querySelector(".wbpv-poster");
      if (posterDom) {
        const matches = posterDom.style.backgroundImage.match(/http(s?).*(?="\))/);
        if (matches?.[0]) {
          setUrl(matches[0]);
        }
      }
    }, []);
    return jsxRuntimeExports.jsx(
      "div",
      {
        className: "video-background",
        style: { backgroundImage: `url(${url})` }
      }
    );
  }
  function FrameSideApp() {
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: jsxRuntimeExports.jsx(ChatHistoryPanel, {}) });
  }
  function VideoBoxApp() {
    const [checked] = useCommentSwitch();
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      checked && jsxRuntimeExports.jsx(VideoComments, {}),
jsxRuntimeExports.jsx(VideoBackground, {})
    ] });
  }
  function VideoControlApp() {
    const [checked, setChecked] = useCommentSwitch();
    const handleClick = (checked2) => setChecked(checked2);
    return jsxRuntimeExports.jsx(CommentSwitch, { checked, onClick: handleClick });
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
    if (videoControlBar) {
      const container = document.createElement("button");
      container.className = "danmu-switch";
      videoControlBar.insertBefore(
        container,
        videoControlBar.querySelector(".wbpv-fullscreen-control")
      );
      ReactDOM.createRoot(container).render(
jsxRuntimeExports.jsx(React.StrictMode, { children: jsxRuntimeExports.jsx(VideoControlApp, {}) })
      );
    }
    const updateComments = async (isFirst) => {
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
        Number("3000")
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

})(React, ReactDOM);