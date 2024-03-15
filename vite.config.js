import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

const BASE_API = "/api"
const TARGET_API = "http:// localhost:8080"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // 允许IP访问
    host: "0.0.0.0",
    // 应用端口 (默认:3000)
    port: 3000,
    // 运行是否自动打开浏览器
    open: false,
    proxy: {
      /** 代理前缀为 /api 的请求  */
      BASE_API: {
        changeOrigin: true,
        // 接口地址
        target: TARGET_API,
        rewrite: (path) =>
            path.replace(new RegExp("^" + BASE_API), ""),
      },
    },
  },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  assetsInclude: ['./src/assets/**/*'],
});
