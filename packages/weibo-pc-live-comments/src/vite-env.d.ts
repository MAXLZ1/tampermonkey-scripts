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
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
