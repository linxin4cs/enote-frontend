<script setup>
import { WarningFilled } from '@element-plus/icons-vue'
</script>

<template>
	<el-card class="max-w-[480px]" shadow="hover">
		<template #header>
			<div class="flex items-center text-xl text-[#e04969]">
				<el-icon><WarningFilled /></el-icon>
				<span class="ml-1 font-bold">注意</span>
			</div>
		</template>
		<p class="font-bold">备份清单：</p>
		<ul class="list-disc ml-4 text-gray-600">
			<li>PostgreSQL 数据库（所有数据文件、索引、事务日志、配置文件等）</li>
			<li>媒体文件（图像、视频、音频）和附件文件</li>
		</ul>
		<el-divider border-style="dashed" />
		<p class="font-bold">
			请在备份前确认本应用如下服务<span class="text-[#e04969]">全部</span>在线：
		</p>
		<template #footer>Footer content</template>
	</el-card>
</template>

<style scoped>
li {
	margin-bottom: 0.3rem;
}
</style>
