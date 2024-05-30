<script setup>
import { ref, h, watch, computed } from 'vue'
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
import router, { toLogin } from '@/utils/router'
import { useRoute } from 'vue-router'
import service from '@/utils/request'
import { ElMessage } from 'element-plus'
import useStore, { resetUserInfo } from '@/utils/store'

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

const store = useStore()

const route = useRoute()
const activePageRoutes = ref([])
const isCollapse = ref(true)
const isExpandIcon = ref(true)

const isWidthLowThan640 = computed(() => window.innerWidth < 640)

updateActivePageRoutes()
if (window.innerWidth > 1024) {
	isCollapse.value = false
	isExpandIcon.value = false
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

function handleCollapse(mode) {
	if (isWidthLowThan640.value) {
		isCollapse.value = true
	} else {
		isCollapse.value = mode === 'fold'
	}

	isExpandIcon.value = mode === 'fold'
}

function logout() {
	service.post('/api/auth/logout').then(() => {
		toLogin('admin')
		ElMessage.success('退出登录成功')
		resetUserInfo()
	})
}
</script>

<template>
	<!--	bg-[#f5f7f9ff]-->
	<el-container class="h-screen bg-white">
		<el-header class="bg-white flex items-center justify-between border-b-2 w-screen">
			<div class="flex items-center">
				<span class="flex text-lg mx-1 hover:cursor-pointer">
					<el-icon v-if="isExpandIcon" @click="() => handleCollapse('expand')"><Expand /></el-icon
					><el-icon v-else @click="() => handleCollapse('fold')"><Fold /></el-icon>
				</span>
				<RouterLink to="/admin">
					<h2 class="text-2xl text-[#2a9a5b] ml-1 text-nowrap">ENote 后台管理</h2>
				</RouterLink>
			</div>
			<el-dropdown>
				<div class="flex items-center text-black text-base hover:text-[#2a9a5b]">
					<span class="text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-36">{{
						store.userInfo.name
					}}</span>
					<el-icon class="ml-1.5 mt-0.5">
						<setting />
					</el-icon>
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<router-link to="/admin/userinfo">
							<el-dropdown-item>个人中心</el-dropdown-item>
						</router-link>
						<el-dropdown-item @click="logout" divided>退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</el-header>
		<el-container>
			<el-aside
				:width="
					isWidthLowThan640 ? (isExpandIcon ? '0rem' : '4rem') : isExpandIcon ? '4rem' : '14rem'
				"
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
						<el-breadcrumb-item :to="items.link" v-for="items in activePageRoutes" :key="items.link"
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
