import { createRouter, createWebHashHistory } from 'vue-router'
import useStore, { setUserInfo } from '@/utils/store'
import { ElMessage } from 'element-plus'
import service from '@/utils/request'

export const AdminLayout = () => import('@/components/layout/AdminLayout.vue')
export const UserLayout = () => import('@/components/layout/UserLayout.vue')
export const AuthView = () => import('@/views/AuthView.vue')
export const LoginBlock = () => import('@/components/auth/LoginBlock.vue')
export const RegisterBlock = () => import('@/components/auth/RegisterBlock.vue')
export const ForgetBlock = () => import('@/components/auth/ForgetBlock.vue')
export const AdminDashboardView = () => import('@/views/admin/AdminDashboardView.vue')
export const UserIconView = () => import('@/views/user/UserIconView.vue')

// 静态路由
export const constantRoutes = [
	{
		path: '/',
		name: 'UserLayout',
		component: UserLayout,
		meta: { title: 'UserLayout', hidden: true },
		redirect: '/latest',
		children: [
			{
				path: 'latest',
				name: 'UserLatestIconView',
				component: UserIconView,
				meta: {
					title: 'UserLatestIconView',
					hidden: true
				},
				props: {
					page: 'latest'
				}
			},
			{
				path: 'latest/note/:noteId',
				name: 'UserLatestNoteViewContent',
				component: () => import('@/views/user/UserNoteView.vue'),
				meta: {
					title: 'UserLatestNoteViewContent',
					hidden: true
				}
			},
			{
				path: 'folder',
				name: 'UserFolderIconView',
				component: UserIconView,
				meta: {
					title: 'UserFolderIconView',
					hidden: true
				},
				props: {
					page: 'folder'
				},
				children: [
					{
						path: ':folderId',
						name: 'UserFolderIconView',
						component: UserIconView,
						meta: {
							title: 'UserFolderIconView',
							hidden: true
						},
						props: {
							page: 'folder'
						}
					}
				]
			},
			{
				path: 'folder/note/:noteId',
				name: 'UserFolderNoteViewContent',
				component: () => import('@/views/user/UserNoteView.vue'),
				meta: {
					title: 'UserFolderNoteViewContent',
					hidden: true
				}
			},
			{
				path: 'folder/:folderId/note/:noteId',
				name: 'UserSubFolderNoteViewContent',
				component: () => import('@/views/user/UserNoteView.vue'),
				meta: {
					title: 'UserSubFolderNoteViewContent',
					hidden: true
				}
			},
			{
				path: 'star',
				name: 'UserStarIconView',
				component: UserIconView,
				meta: {
					title: 'UserStarIconView',
					hidden: true
				},
				props: {
					page: 'star'
				},
				children: [
					{
						path: 'note',
						name: 'UserStarNoteView',

						meta: {
							title: 'UserStarNoteView',
							hidden: true
						}
					}
				]
			},
			{
				path: 'star/note/:noteId',
				name: 'UserStarNoteViewContent',
				component: () => import('@/views/user/UserNoteView.vue'),
				meta: {
					title: 'UserStarNoteViewContent',
					hidden: true
				}
			},
			{
				path: 'tag',
				name: 'UserTagIconView',
				component: UserIconView,
				meta: {
					title: 'UserTagIconView',
					hidden: true
				},
				props: {
					page: 'tag'
				},
				children: [
					{
						path: ':tagId',
						name: 'UserTagIconView',
						component: UserIconView,
						meta: {
							title: 'UserTagIconView',
							hidden: true
						},
						props: {
							page: 'tag'
						}
					}
				]
			},
			{
				path: 'tag/:tagId/note/:noteId',
				name: 'UserTagNoteViewContent',
				component: () => import('@/views/user/UserNoteView.vue'),
				meta: {
					title: 'UserTagNoteViewContent',
					hidden: true
				}
			},
			{
				path: 'userinfo',
				name: 'UserInfoView',
				component: () => import('@/views/UserInfoView.vue'),
				meta: {
					title: 'UserInfoView',
					hidden: true
				}
			},
			{
				path: 'statistics',
				name: 'UserStatisticsView',
				component: () => import('@/views/user/UserStatisticsView.vue'),
				meta: {
					title: 'UserStatisticsView',
					hidden: true
				}
			},
			{
				path: 'settings',
				name: 'UserSettingsView',
				component: () => import('@/views/user/UserSettingsView.vue'),
				meta: {
					title: 'UserSettingsView',
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
				component: AdminDashboardView,
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
		if (store.userInfo.id === '') {
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
	// console.log(router.currentRoute.value.path)
})

export default router
