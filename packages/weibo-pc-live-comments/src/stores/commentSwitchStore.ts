import { createLocalStorageStore } from "./createLocalStorageStore";

export const commentSwitchStore = createLocalStorageStore(
  `${import.meta.env.VITE_LOCALSTORAGE_KEY_PREFIX}-video-comments-enabled"`,
  true,
);
