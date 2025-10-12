import { createLocalStorageStore } from "./createLocalStorageStore";

export type GlobalSetting = {
  autoSearchLive: boolean;
  autoRedirectLive: boolean;
  requestGap: number;
  maxCommentsNum: number;
  commentSpeed: number;
};

const localStorageStore = createLocalStorageStore<GlobalSetting>(
  `${import.meta.env.VITE_LOCALSTORAGE_KEY_PREFIX}-global-setting"`,
  {
    autoSearchLive: import.meta.env.VITE_AUTO_SEARCH_LIVE === "true",
    autoRedirectLive: import.meta.env.VITE_REDIRECT_LIVE === "true",
    requestGap: Number(import.meta.env.VITE_REQUEST_GAP),
    maxCommentsNum: Number(import.meta.env.VITE_MAX_COMMENTS_NUMBER),
    commentSpeed: Number(import.meta.env.VITE_COMMENT_DURATION),
  },
);

export const globalSettingStore = {
  getGlobalSetting: localStorageStore.getSnapshot,
  setGlobalSetting: localStorageStore.setValue,
  useGlobalSetting: localStorageStore.useStore,
  subscribe: localStorageStore.subscribe,
};
