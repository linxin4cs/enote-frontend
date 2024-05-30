import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/

// eslint-disable-next-line no-undef
const env = loadEnv('', process.cwd())

export default defineConfig({
	server: {
		// 允许IP访问
		host: '0.0.0.0',
		// 应用端口 (默认:3000)
		port: 3000,
		// 运行是否自动打开浏览器
		open: false,
		proxy: {
			/** 代理前缀为 /api 的请求  */
			[env.VITE_APP_BASE_API]: {
				changeOrigin: true,
				// 接口地址
				target: env.VITE_APP_API_URL
			}
		}
	},
	plugins: [
		vue(),
		AutoImport({
			resolvers: [ElementPlusResolver()]
		}),
		Components({
			resolvers: [ElementPlusResolver()]
		}),
		[
			'import',
			{
				libraryName: '@icon-park/vue',
				libraryDirectory: 'es/icons',
				camel2DashComponentName: false // default: true,
			}
		]
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
})
