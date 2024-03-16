<script setup>
import { ref, h, watch } from 'vue'
import {
	EditPen,
	PieChart,
	Setting,
	Expand,
	Fold,
	User,
	Monitor,
	CopyDocument,
	DocumentCopy
} from '@element-plus/icons-vue'
import router from '@/router'
import { useRoute } from 'vue-router'

const PAGES = {
	AdminDashboardView: [
		{
			title: '仪表盘',
			link: '/admin/dashboard'
		}
	],
	AdminManagementUserView: [
		{
			title: '管理',
			link: '/admin/management'
		},
		{
			title: '用户',
			link: '/admin/management/user'
		}
	],
	AdminMaintenanceBackupView: [
		{
			title: '维护',
			link: '/admin/maintenance'
		},
		{
			title: '备份',
			link: '/admin/maintenance/backup'
		}
	],
	AdminMaintenanceRestoreView: [
		{
			title: '维护',
			link: '/admin/maintenance'
		},
		{
			title: '恢复',
			link: '/admin/maintenance/backup'
		}
	],
	AdminInfoView: [
		{
			title: '个人中心',
			link: '/admin/userinfo'
		}
	]
}
const route = useRoute()
const activePageRoutes = ref([])
const isCollapse = ref(true)

updateActivePageRoutes()
if (window.innerWidth > 1024) {
	isCollapse.value = false
}

watch(
	() => route.name,
	() => {
		updateActivePageRoutes()
	}
)

function updateActivePageRoutes() {
	activePageRoutes.value = PAGES[route.name.toString()] || []
}

function separator() {
	return h('span', { class: 'text-[#95cdad] font-bold' }, '/')
}
</script>

<template>
	<!--	bg-[#f5f7f9ff]-->
	<el-container class="h-screen bg-white">
		<el-header class="bg-white flex items-center justify-between border-b-2">
			<RouterLink to="/admin">
				<h2 class="text-2xl text-[#2a9a5b] ml-1">ENote 后台管理</h2>
			</RouterLink>
			<el-dropdown>
				<div class="flex items-center text-black text-base">
					<span>张林鑫 ( Admin )</span>
					<el-icon class="ml-1.5 mt-0.5">
						<setting />
					</el-icon>
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<router-link to="/admin/userinfo">
							<el-dropdown-item>个人中心</el-dropdown-item>
						</router-link>
						<el-dropdown-item divided>退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</el-header>
		<el-container>
			<el-aside
				:width="isCollapse ? '4rem' : '14rem'"
				class="bg-white border-r-2 transition-all duration-500 overflow-hidden"
			>
				<el-scrollbar>
					<el-menu
						class="clear-border"
						active-text-color="#2a9a5b"
						:collapse="isCollapse"
						:default-active="router.currentRoute.value.name.toString()"
						router
					>
						<el-menu-item v-if="isCollapse" @click="isCollapse = false">
							<el-icon><Expand /></el-icon>
							<template #title>展开</template>
						</el-menu-item>
						<el-menu-item v-else @click="isCollapse = true">
							<el-icon><Fold /></el-icon>
							<template #title>折叠</template>
						</el-menu-item>
						<el-menu-item index="AdminDashboardView" @click="router.push('/admin/dashboard')">
							<el-icon><PieChart /></el-icon>
							<span>仪表盘</span>
						</el-menu-item>
						<el-sub-menu index="AdminManagement">
							<template #title>
								<el-icon><EditPen /></el-icon>
								<span>管理</span>
							</template>
							<el-menu-item
								index="AdminManagementUserView"
								@click="router.push('/admin/management/user')"
							>
								<el-icon><User /></el-icon>
								<span>用户</span>
							</el-menu-item>
						</el-sub-menu>
						<el-sub-menu index="AdminMaintenance">
							<template #title>
								<el-icon><Monitor /></el-icon>
								<span>维护</span>
							</template>
							<el-menu-item
								index="AdminMaintenanceBackupView"
								@click="router.push('/admin/maintenance/backup')"
							>
								<el-icon><CopyDocument /></el-icon>
								<span>备份</span>
							</el-menu-item>
							<el-menu-item
								index="AdminMaintenanceRestoreView"
								@click="router.push('/admin/maintenance/restore')"
							>
								<el-icon><DocumentCopy /></el-icon>
								<span>恢复</span>
							</el-menu-item>
						</el-sub-menu>
					</el-menu></el-scrollbar
				></el-aside
			>
			<el-container>
				<el-header class="bg-white flex items-center justify-start border-b-2 text-xl">
					<el-breadcrumb :separator-icon="separator" class="el-breadcrumb">
						<el-breadcrumb-item
							:to="{ path: items.link }"
							v-for="items in activePageRoutes"
							:key="items.link"
							><span class="text-[#195c37]">{{ items.title }}</span></el-breadcrumb-item
						>
					</el-breadcrumb>
				</el-header>
				<el-main class="el-main">
					<router-view />
				</el-main>
			</el-container>
		</el-container>
	</el-container>
</template>

<style scoped>
.clear-border {
	border: none;
}
.el-main {
	padding: 0.7rem 1.3rem;
}
.el-breadcrumb {
	font-size: 1.2rem;
}
</style>
