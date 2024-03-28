import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import useStore, { setUserInfo } from '@/utils/store'
import { ElMessage } from 'element-plus'
import service from '@/utils/requests'

export const AdminLayout = () => import('@/components/AdminLayout.vue')
export const AuthView = () => import('@/views/AuthView.vue')
export const LoginBlock = () => import('@/components/Auth/LoginBlock.vue')
export const RegisterBlock = () => import('@/components/Auth/RegisterBlock.vue')
export const ForgetBlock = () => import('@/components/Auth/ForgetBlock.vue')

// 静态路由
export const constantRoutes = [
	{
		path: '/',
		name: 'UserLayout',
		meta: { title: 'UserLayout', hidden: true },
		redirect: '/userinfo',
		children: [
			{
				path: 'userinfo',
				name: 'UserInfoView',
				component: () => import('@/views/UserInfoView.vue'),
				meta: {
					title: 'UserInfoView',
					hidden: true
				}
			}
		]
	},
	{
		path: '/admin',
		name: 'AdminLayout',
		component: AdminLayout,
		meta: { title: 'AdminLayout', hidden: true },
		redirect: '/admin/dashboard',
		children: [
			{
				path: 'dashboard',
				name: 'AdminDashboardView',
				component: () => import('@/views/admin/AdminDashboardView.vue'),
				meta: {
					title: 'AdminDashboardView'
				}
			},
			{
				path: 'management',
				name: 'AdminManagement',
				redirect: '/admin/management/user',
				meta: {
					title: 'AdminManagement'
				},
				children: [
					{
						path: 'user',
						name: 'AdminManagementUserView',
						component: () => import('@/views/admin/management/AdminManagementUserView.vue'),
						meta: {
							title: 'AdminManagementUserView'
						}
					}
				]
			},
			{
				path: 'maintenance',
				name: 'AdminMaintenance',
				redirect: '/admin/maintenance/backup',
				meta: {
					title: 'AdminMaintenance'
				},
				children: [
					{
						path: 'backup',
						name: 'AdminMaintenanceBackupView',
						component: () => import('@/views/admin/maintenance/AdminMaintenanceBackupView.vue'),
						meta: {
							title: 'AdminMaintenanceBackupView'
						}
					},
					{
						path: 'restore',
						name: 'AdminMaintenanceRestoreView',
						component: () => import('@/views/admin/maintenance/AdminMaintenanceRestoreView.vue'),
						meta: {
							title: 'AdminMaintenanceRestoreView'
						}
					}
				]
			},
			{
				path: 'userinfo',
				name: 'AdminInfoView',
				component: () => import('@/views/UserInfoView.vue'),
				meta: {
					title: 'AdminInfoView',
					hidden: true
				}
			}
		]
	},
	{
		path: '/admin/auth',
		name: 'AdminAuthView',
		component: AuthView,
		meta: {
			title: 'AdminAuthView',
			hidden: true
		},
		redirect: '/admin/auth/login',
		children: [
			{
				path: 'login',
				name: 'AdminAuthLoginBlock',
				component: LoginBlock,
				meta: {
					title: 'AdminAuthLoginBlock',
					hidden: true
				},
				props: {
					pageMode: 'admin'
				}
			},
			{
				path: 'forget',
				name: 'AdminAuthForgetBlock',
				component: ForgetBlock,
				meta: {
					title: 'AdminAuthForgetBlock',
					hidden: true
				},
				props: {
					pageMode: 'admin'
				}
			}
		]
	},
	{
		path: '/auth',
		name: 'UserAuthView',
		component: AuthView,
		meta: {
			title: 'UserAuthView',
			hidden: true
		},
		redirect: '/auth/login',
		children: [
			{
				path: 'login',
				name: 'UserAuthLoginBlock',
				component: LoginBlock,
				meta: {
					title: 'UserAuthLoginBlock',
					hidden: true
				},
				props: {
					pageMode: 'user'
				}
			},
			{
				path: 'register',
				name: 'UserAuthRegisterBlock',
				component: RegisterBlock,
				meta: {
					title: 'UserAuthRegisterBlock',
					hidden: true
				},
				props: {
					pageMode: 'user'
				}
			},
			{
				path: 'forget',
				name: 'UserAuthForgetBlock',
				component: ForgetBlock,
				meta: {
					title: 'UserAuthForgetBlock',
					hidden: true
				},
				props: {
					pageMode: 'user'
				}
			}
		]
	},
	{
		path: '/404',
		component: () => import('@/views/404View.vue'),
		meta: { hidden: true },
		props: {
			message: '页面不存在...'
		}
	},
	{ path: '/:pathMatch(.*)', redirect: '/404', meta: { hidden: true } }
]

/**
 * 创建路由
 */
const router = createRouter({
	history: createWebHashHistory(),
	routes: constantRoutes,
	// 刷新时，滚动条位置还原
	scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * 重置路由
 */
export function toLogin(mode) {
	let redirectPath = '/auth/login'

	if (mode) {
		if (mode === 'admin') {
			redirectPath = '/admin' + redirectPath
		}
	} else {
		if (
			typeof router.currentRoute.value.name === 'string' &&
			router.currentRoute.value.name.includes('Admin')
		) {
			redirectPath = '/admin' + redirectPath
		}
	}

	router.replace({ path: redirectPath }).then(() => {})
}

router.beforeEach(async (to, from, next) => {
	const store = useStore()

	if (store.isFeteched.userInfo === false) {
		store.isFeteched.userInfo = true
		await service.get('/api/user/me').then((data) => {
			setUserInfo(data.data)
		})
	}

	if (to.name) {
		if (store.userInfo.id === 0) {
			if (!to.name.startsWith('AdminAuth') && to.name.startsWith('Admin')) {
				ElMessage.error('没有权限，请登录！')
				next('/admin/auth/login')
				return
			} else if (!to.name.startsWith('UserAuth') && to.name.startsWith('User')) {
				ElMessage.error('没有权限，请登录！')
				next('/auth/login')
				return
			}
		} else {
			if (to.name.startsWith('AdminAuth')) {
				if (store.userInfo.role === 1 || store.userInfo.role === 2) {
					ElMessage.warning('已经登录！')
					next('/admin')
					return
				}
			} else if (to.name.startsWith('UserAuth')) {
				ElMessage.warning('已经登录！')
				next('/')
				return
			}

			if (!to.name.startsWith('AdminAuth') && to.name.startsWith('Admin')) {
				if (store.userInfo.role === 0) {
					ElMessage.error('没有管理员权限！')
					next('/')
					return
				}
			}
		}
	}

	next()
})

router.afterEach(() => {
	console.log(router.currentRoute.value.path)
})

export default router
