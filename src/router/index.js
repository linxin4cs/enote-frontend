import { createRouter, createWebHashHistory } from "vue-router";

export const AdminLayout = () => import("@/layout/AdminLayout.vue");
export const AuthView = () => import("@/views/AuthView.vue");
export const LoginBlock = () => import("@/components/Auth/LoginBlock.vue");
export const RegisterBlock = () =>
	import("@/components/Auth/RegisterBlock.vue");
export const ForgetBlock = () => import("@/components/Auth/ForgetBlock.vue");

// 静态路由
export const constantRoutes = [
	{
		path: "/",
		meta: { hidden: true },
		redirect: "/admin",
	},
	{
		// TODO 随机生成路径，防止被爬虫爬取
		path: "/admin",
		component: AdminLayout,
		meta: { hidden: true },
		redirect: "/admin/dashboard",
		children: [
			{
				path: "dashboard",
				name: "AdminDashboardView",
				component: () => import("@/views/admin/AdminDashboardView.vue"),
				meta: {
					title: "AdminDashboardView",
				},
			},
			{
				path: "management",
				name: "AdminManagement",
				redirect: "/admin/management/user",
				meta: {
					title: "AdminManagement",
				},
				children: [
					{
						path: "user",
						name: "AdminUserManagementView",
						component: () =>
							import("@/views/admin/management/AdminUserManagementView.vue"),
						meta: {
							title: "AdminUserManagementView",
						},
					},
				],
			},
			{
				path: "maintenance",
				name: "AdminMaintenanceView",
				component: () => import("@/views/admin/AdminMaintenanceView.vue"),
				meta: {
					title: "AdminMaintenanceView",
				},
			},
		],
	},
	{
		path: "/admin/auth",
		name: "AdminAuthView",
		component: AuthView,
		meta: {
			title: "AdminAuthView",
			hidden: true,
		},
		redirect: "/admin/auth/login",
		children: [
			{
				path: "login",
				name: "AdminLoginBlock",
				component: LoginBlock,
				meta: {
					title: "AdminLoginBlock",
					hidden: true,
				},
				props: {
					pageMode: "admin",
				},
			},
			{
				path: "forget",
				name: "AdminForgetBlock",
				component: ForgetBlock,
				meta: {
					title: "AdminForgetBlock",
					hidden: true,
				},
				props: {
					pageMode: "admin",
				},
			},
		],
	},
	{
		path: "/auth",
		name: "UserAuthView",
		component: AuthView,
		meta: {
			title: "UserAuthView",
			hidden: true,
		},
		redirect: "/auth/login",
		children: [
			{
				path: "login",
				name: "UserLoginBlock",
				component: LoginBlock,
				meta: {
					title: "UserLoginBlock",
					hidden: true,
				},
				props: {
					pageMode: "user",
				},
			},
			{
				path: "register",
				name: "UserRegisterBlock",
				component: RegisterBlock,
				meta: {
					title: "UserRegisterBlock",
					hidden: true,
				},
				props: {
					pageMode: "user",
				},
			},
			{
				path: "forget",
				name: "UserForgetBlock",
				component: ForgetBlock,
				meta: {
					title: "UserForgetBlock",
					hidden: true,
				},
				props: {
					pageMode: "user",
				},
			},
		],
	},
	{
		path: "/401",
		component: () => import("@/views/error/401View.vue"),
		meta: { hidden: true },
		props: {
			message: "站长说你不能进入这个页面...",
		},
	},
	{
		path: "/404",
		component: () => import("@/views/error/404View.vue"),
		meta: { hidden: true },
		props: {
			message: "页面不存在...",
		},
	},
	{ path: "/:pathMatch(.*)", redirect: "/404", meta: { hidden: true } },

	// {
	// 	path: "/",
	// 	name: "/",
	// 	component: Layout,
	// 	redirect: "/dashboard",
	// 	children: [
	// 		{
	// 			path: "dashboard",
	// 			component: () => import("@/views/dashboard/index.vue"),
	// 			name: "Dashboard", // 用于 keep-alive, 必须与SFC自动推导或者显示声明的组件name一致
	// 			// https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
	// 			meta: {
	// 				title: "dashboard",
	// 				icon: "homepage",
	// 				affix: true,
	// 				keepAlive: true,
	// 				alwaysShow: false,
	// 			},
	// 		},
	// 		{
	// 			path: "401",
	// 			component: () => import("@/views/error-page/401View.vue"),
	// 			meta: { hidden: true },
	// 		},
	// 		{
	// 			path: "404",
	// 			component: () => import("@/views/error-page/404View.vue"),
	// 			meta: { hidden: true },
	// 		},
	// 	],
	// },

	// 外部链接
	// {
	//   path: "/external-link",
	//   component: Layout,
	//   children: [ {
	//       component: () => import("@/views/external-link/index.vue"),
	//       path: "https://www.cnblogs.com/",
	//       meta: { title: "外部链接", icon: "link" },
	//     },
	//   ],
	// },
	// 多级嵌套路由
	/* {
         path: '/nested',
         component: Layout,
         redirect: '/nested/level1/level2',
         name: 'Nested',
         meta: {title: '多级菜单', icon: 'nested'},
         children: [
             {
                 path: 'level1',
                 component: () => import('@/views/nested/level1/index.vue'),
                 name: 'Level1',
                 meta: {title: '菜单一级'},
                 redirect: '/nested/level1/level2',
                 children: [
                     {
                         path: 'level2',
                         component: () => import('@/views/nested/level1/level2/index.vue'),
                         name: 'Level2',
                         meta: {title: '菜单二级'},
                         redirect: '/nested/level1/level2/level3',
                         children: [
                             {
                                 path: 'level3-1',
                                 component: () => import('@/views/nested/level1/level2/level3/index1.vue'),
                                 name: 'Level3-1',
                                 meta: {title: '菜单三级-1'}
                             },
                             {
                                 path: 'level3-2',
                                 component: () => import('@/views/nested/level1/level2/level3/index2.vue'),
                                 name: 'Level3-2',
                                 meta: {title: '菜单三级-2'}
                             }
                         ]
                     }
                 ]
             },
         ]
     }*/
];

/**
 * 创建路由
 */
const router = createRouter({
	history: createWebHashHistory(),
	routes: constantRoutes,
	// 刷新时，滚动条位置还原
	scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 重置路由
 */
export function resetRouter() {
	router.replace({ path: "/login" }).then(() => {});
}

export default router;
