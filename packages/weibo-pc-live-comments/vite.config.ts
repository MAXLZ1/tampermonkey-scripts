import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    monkey({
      entry: "src/main.tsx",
      userscript: {
        name: "微博PC直播弹幕助手",
        description: "在微博PC端生成弹幕。",
        author: "MAXLZ",
        license: "MIT",
        icon: "https://weibo.com/favicon.ico",
        namespace: "npm/weibo-pc-live-comments",
        match: ["https://weibo.com/l/wblive/p/show/*"],
        grant: "none",
      },
      build: {
        externalGlobals: {
          react: [
            "React",
            () =>
              "https://cdn.jsdelivr.net/npm/umd-react@19.2.0/dist/react.production.min.js",
          ],
          "react-dom/client": [
            "ReactDOM",
            () =>
              "https://cdn.jsdelivr.net/npm/umd-react@19.2.0/dist/react-dom.production.min.js",
          ],
        },
      },
    }),
  ],
});
