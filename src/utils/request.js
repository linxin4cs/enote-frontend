import axios from 'axios'
// import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'
import { resetUserInfo } from '@/utils/store'
import router, { toLogin } from '@/utils/router'

const service = axios.create({
	timeout: 50000,
	headers: { 'Content-Type': 'application/json;charset=utf-8' },
	withCredentials: true
})

// service.interceptors.request.use(
// 	(config) => {
// 		const csrfToken = Cookies.get('XSRF-TOKEN') // 假设 CSRF 令牌存储在名为 'XSRF-TOKEN' 的 Cookie 中
// 		if (csrfToken) {
// 			config.headers['X-XSRF-TOKEN'] = csrfToken // 设置 CSRF 令牌头部。请根据后端要求设置正确的头部名称
// 		}
// 		return config
// 	},
// 	(error) => {
// 		// 处理请求错误
// 		return Promise.reject(error)
// 	}
// )

service.interceptors.response.use(
	(response) => {
		const { code, data } = response.data

		if (code === 200 || code === 201) {
			return data
		}

		if (code === 401) {
			if (
				typeof router.currentRoute.value.name === 'string' &&
				!router.currentRoute.value.name.includes('Auth')
			) {
				ElMessage.error('当前页面已失效，请重新登录')
			}
			resetUserInfo()
			toLogin()
		}

		// ElMessage.error(data.message || '系统出错')
		return Promise.reject({ code, data } || 'Error')
	},
	(error) => {
		console.log(error)

		if (!error.data) {
			error.data = {
				code: error.response.status,
				message: error.message
			}
		}

		// const { code, data } = error.response.data
		// token 过期,重新登录

		// ElMessage.error(data.message || '系统出错')
		//
		return Promise.reject(error || 'Error')
	}
)

export default service
