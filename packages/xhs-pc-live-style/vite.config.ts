import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        name: "小红书PC端直播美化脚本",
        description: "自动点击播放，去除底部按钮，调整视频显示比例",
        author: "MAXLZ",
        license: "MIT",
        icon: "https://www.xiaohongshu.com/favicon.ico",
        namespace: "npm/xhs-pc-live-style",
        match: ["https://www.xiaohongshu.com/livestream/dynpath*"],
        grant: "none",
      },
    }),
  ],
});
