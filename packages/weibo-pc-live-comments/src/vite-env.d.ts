/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
//// <reference types="vite-plugin-monkey/global" />
/// <reference types="vite-plugin-monkey/style" />
/// <reference types="vite-plugin-svgr/client" />

interface ViteTypeOptions {}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_MAX_COMMENTS_NUMBER: string;
  readonly VITE_REQUEST_GAP: string;
  readonly VITE_MAX_RANDOM_GAP: string;
  readonly VITE_MAX_TRACKS: string;
  readonly VITE_TRACK_HEIGHT: string;
  readonly VITE_COMMENT_DURATION: string;
  readonly VITE_COMMENTS_SAFE_GAP: string;
  readonly VITE_LOCALSTORAGE_KEY_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
