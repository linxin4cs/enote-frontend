<script setup>
import { ref } from "vue";
import {
	Document,
	Menu as IconMenu,
	Location,
	Setting,
	Expand,
	Fold,
} from "@element-plus/icons-vue";

const isCollapse = ref(true);
const handleOpen = (key, keyPath) => {
	console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
	console.log(key, keyPath);
};
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
						default-active="2"
						class="clear-border"
						:collapse="isCollapse"
						@open="handleOpen"
						@close="handleClose"
					>
						<el-menu-item v-if="isCollapse" @click="isCollapse = false">
							<el-icon><Expand /></el-icon>
							<template #title>展开</template>
						</el-menu-item>
						<el-menu-item v-else @click="isCollapse = true">
							<el-icon><Fold /></el-icon>
							<template #title>折叠</template>
						</el-menu-item>
						<el-sub-menu index="1">
							<template #title>
								<el-icon><location /></el-icon>
								<span>Navigator One</span>
							</template>
							<el-menu-item-group>
								<template #title><span>Group One</span></template>
								<el-menu-item index="1-1">item one</el-menu-item>
								<el-menu-item index="1-2">item two</el-menu-item>
							</el-menu-item-group>
							<el-menu-item-group title="Group Two">
								<el-menu-item index="1-3">item three</el-menu-item>
							</el-menu-item-group>
							<el-sub-menu index="1-4">
								<template #title><span>item four</span></template>
								<el-menu-item index="1-4-1">item one</el-menu-item>
							</el-sub-menu>
						</el-sub-menu>
						<el-menu-item index="2">
							<el-icon><icon-menu /></el-icon>
							<template #title>Navigator Two</template>
						</el-menu-item>
						<el-menu-item index="3" disabled>
							<el-icon><document /></el-icon>
							<template #title>Navigator Three</template>
						</el-menu-item>
						<el-menu-item index="4">
							<el-icon><setting /></el-icon>
							<template #title>Navigator Four</template>
						</el-menu-item>
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
