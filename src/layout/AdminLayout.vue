<script setup>
import { ref, onMounted } from "vue";
import {
	EditPen,
	PieChart,
	Setting,
	Expand,
	Fold,
	User,
	Monitor,
	CopyDocument,
} from "@element-plus/icons-vue";
import router from "@/router";

const isCollapse = ref(true);

onMounted(() => {
	if (window.innerWidth > 1024) {
		isCollapse.value = false;
	}
});
</script>

<template>
	<el-container class="h-screen bg-[#f5f7f9ff]">
		<el-header class="bg-white flex items-center justify-between border-b-2">
			<RouterLink to="/admin">
				<h2 class="text-2xl text-[#2a9a5b]">ENote 后台管理</h2>
			</RouterLink>
			<el-dropdown>
				<div class="flex items-center text-black">
					<span>张林鑫 ( Admin )</span>
					<el-icon class="ml-1.5 mt-0.5">
						<setting />
					</el-icon>
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item>退出登录</el-dropdown-item>
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
						<el-menu-item
							index="AdminDashboardView"
							@click="router.push('/admin/dashboard')"
						>
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
								<span>备份 & 恢复</span>
							</el-menu-item>
						</el-sub-menu>
					</el-menu></el-scrollbar
				></el-aside
			>
			<el-main class="reset-padding">
				<RouterView />
			</el-main>
		</el-container>
	</el-container>
</template>

<style scoped>
.clear-border {
	border: none;
}
.reset-padding {
	padding: 0.9rem;
}
</style>
