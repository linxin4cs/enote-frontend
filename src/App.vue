<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import useStore from '@/utils/store'

const store = useStore()

const userAgent = navigator.userAgent
const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)
if (isMobile) {
	store.deviceType = '移动设备'
} else {
	store.deviceType = '桌面设备'
}
</script>

<template>
	<el-config-provider :locale="zhCn">
		<router-view />
	</el-config-provider>
</template>

<style scoped></style>
