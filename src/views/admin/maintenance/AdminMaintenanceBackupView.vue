<script setup>
import { computed, reactive, ref } from 'vue'
import {
	CircleCloseFilled,
	CloseBold,
	CopyDocument,
	Edit,
	Loading,
	Select,
	SuccessFilled,
	WarningFilled
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

const PROGRESS_STATUS = {
	loading: {
		color: '#1f87e8ff',
		percentage: 70
	},
	success: {
		color: '#2a9a5b',
		percentage: 100
	},
	fail: {
		color: '#e04969',
		percentage: 90
	}
}

const activeStep = ref(0)
const serviceStatus = reactive({
	mysql: 'offline',
	mongodb: 'offline',
	redis: 'offline',
	file: 'offline'
})
const isShowBackupDownloadInfo = ref(false)
const isConfirmBackupDownloadInfo = ref(false)

// loading, success, fail
const backupStatus = ref('loading')
const failReason = ref('系统无足够空间用于存储备份文件！')

const isAllServicesOnline = computed(() => {
	return (
		serviceStatus.mysql === 'online' &&
		serviceStatus.mongodb === 'online' &&
		serviceStatus.redis === 'online' &&
		serviceStatus.file === 'online'
	)
})

function handleRefreshService() {
	serviceStatus.mysql = 'loading'
	serviceStatus.mongodb = 'loading'
	serviceStatus.redis = 'loading'
	serviceStatus.file = 'loading'

	setTimeout(() => {
		serviceStatus.mysql = 'online'
		serviceStatus.mongodb = 'online'
		serviceStatus.redis = 'online'
		serviceStatus.file = 'online'
	}, 1500)
}

const backupTimer = ref(-1)

function handleStartBackup() {
	activeStep.value = 1

	if (backupTimer.value !== -1) {
		clearTimeout(backupTimer.value)
	}

	backupTimer.value = setTimeout(() => {
		backupStatus.value = 'success'
	}, 2500)
}

function handlePrevStep() {
	activeStep.value = 0
	backupStatus.value = 'loading'
	clearTimeout(backupTimer.value)
	handleRefreshService()
}

function handleCancelBackup() {
	ElMessageBox.confirm('确定取消备份？', '注意', {
		confirmButtonText: '确定',
		cancelButtonText: '取消'
	}).then(() => {
		handlePrevStep()
	})
}

async function handleBackupDownload() {
	isConfirmBackupDownloadInfo.value = false
	isShowBackupDownloadInfo.value = false

	const zip = new JSZip()
	// 添加文件到ZIP中。这里只是示例，可以根据实际需要添加不同的文件和内容
	zip.file('example.txt', '这是一个文本文件的内容')

	// 生成ZIP文件并触发下载
	const content = await zip.generateAsync({ type: 'blob' })
	saveAs(content, 'backup.zip')
}

function handleShowFailReason() {
	ElMessageBox.alert('This is a message', 'Title', {
		title: '失败信息',
		autofocus: false,
		message: failReason.value,
		confirmButtonText: '已知晓'
	})
}

handleRefreshService()
</script>

<template>
	<el-dialog v-model="isShowBackupDownloadInfo" class="max-w-96">
		<template #header>
			<div class="flex items-center text-xl text-[#e04969]">
				<el-icon>
					<WarningFilled />
				</el-icon>
				<span class="ml-1 font-bold">注意</span>
			</div>
		</template>
		<span
			>如非<span class="text-[#e04969]">特殊</span>情况，<span class="text-[#e04969]">请勿</span
			>解包下载后的备份文件</span
		>
		<div>
			<el-checkbox v-model="isConfirmBackupDownloadInfo">已知晓</el-checkbox>
		</div>
		<template #footer>
			<el-tooltip
				effect="dark"
				content="请确认已知晓备份文件注意事项"
				:disabled="isConfirmBackupDownloadInfo"
			>
				<el-button
					type="primary"
					color="#2a9a5b"
					:disabled="!isConfirmBackupDownloadInfo"
					@click="handleBackupDownload"
					>确定
				</el-button>
			</el-tooltip>
		</template>
	</el-dialog>
	<el-steps class="max-w-[480px] el-steps" :active="activeStep" finish-status="success" simple>
		<el-step title="确认" :icon="Edit" />
		<el-step title="备份" :icon="CopyDocument" />
	</el-steps>
	<Transition name="el-fade-in-linear" mode="out-in">
		<el-card class="max-w-[480px]" shadow="hover" v-if="activeStep === 0">
			<template #header>
				<div class="flex items-center text-xl text-[#e04969]">
					<el-icon>
						<WarningFilled />
					</el-icon>
					<span class="ml-1 font-bold">注意</span>
				</div>
			</template>
			<p class="font-bold">备份清单：</p>
			<ul class="list-disc ml-4 text-gray-600">
				<!--				<li>-->
				<!--					MySQL 数据库-->
				<!--					<ul class="list-disc ml-4 text-gray-500">-->
				<!--						<li>所有数据文件（用户、笔记等）</li>-->
				<!--						<li>视图和索引</li>-->
				<!--						<li>事务日志</li>-->
				<!--						<li>等其他文件</li>-->
				<!--					</ul>-->
				<!--				</li>-->
				<!--				<li>-->
				<!--					MongoDB 数据库-->
				<!--				</li>-->
				<!--				<li>-->
				<!--					Redis 数据库-->
				<!--				</li>-->
				<li>所有数据文件（用户、笔记等）</li>
				<li>视图和索引</li>
				<li>事务日志</li>
				<li>
					二进制文件
					<ul class="list-disc ml-4 text-gray-500">
						<li>图像</li>
						<li>视频</li>
						<li>音频</li>
					</ul>
				</li>
				<!--				<li>等其他文件</li>-->
			</ul>
			<el-divider border-style="dashed" />
			<p class="font-bold">
				请在备份前确认本应用如下服务<span class="text-[#e04969]">全部</span>在线：
			</p>
			<ul class="list-disc text-gray-500 ml-0">
				<li class="flex items-center">
					<el-icon color="#2a9a5b" class="mr-0.5" v-if="serviceStatus.mysql === 'online'"
						><Select
					/></el-icon>
					<el-icon color="#e04969" class="mr-0.5" v-else-if="serviceStatus.mysql === 'offline'">
						<CloseBold />
					</el-icon>
					<el-icon
						color="#1f87e8ff"
						class="is-loading mr-0.5"
						v-else-if="serviceStatus.mysql === 'loading'"
					>
						<Loading />
					</el-icon>
					MySQL
				</li>
				<li class="flex items-center">
					<el-icon color="#2a9a5b" class="mr-0.5" v-if="serviceStatus.mongodb === 'online'"
						><Select
					/></el-icon>
					<el-icon color="#e04969" class="mr-0.5" v-else-if="serviceStatus.mongodb === 'offline'">
						<CloseBold />
					</el-icon>
					<el-icon
						color="#1f87e8ff"
						class="is-loading mr-0.5"
						v-else-if="serviceStatus.mongodb === 'loading'"
					>
						<Loading />
					</el-icon>
					MongoDB
				</li>
				<li class="flex items-center">
					<el-icon color="#2a9a5b" class="mr-0.5" v-if="serviceStatus.redis === 'online'"
						><Select
					/></el-icon>
					<el-icon color="#e04969" class="mr-0.5" v-else-if="serviceStatus.redis === 'offline'">
						<CloseBold />
					</el-icon>
					<el-icon
						color="#1f87e8ff"
						class="is-loading mr-0.5"
						v-else-if="serviceStatus.redis === 'loading'"
					>
						<Loading />
					</el-icon>
					Redis
				</li>
				<li class="flex items-center">
					<el-icon color="#2a9a5b" class="mr-0.5" v-if="serviceStatus.file === 'online'"
						><Select
					/></el-icon>
					<el-icon color="#e04969" class="mr-0.5" v-else-if="serviceStatus.file === 'offline'">
						<CloseBold />
					</el-icon>
					<el-icon
						color="#1f87e8ff"
						class="is-loading mr-0.5"
						v-else-if="serviceStatus.file === 'loading'"
					>
						<Loading />
					</el-icon>
					文件存储
				</li>
			</ul>
			<template #footer>
				<div class="flex justify-between">
					<el-button type="primary" color="#2a9a5b" plain @click="handleRefreshService"
						>刷新服务
					</el-button>
					<el-tooltip
						class="box-item"
						effect="dark"
						content="请确认服务全部在线"
						:disabled="isAllServicesOnline"
					>
						<el-button
							type="primary"
							color="#2a9a5b"
							:disabled="!isAllServicesOnline"
							@click="handleStartBackup"
							>开始备份
						</el-button>
					</el-tooltip>
				</div>
			</template>
		</el-card>
		<el-card class="max-w-[480px]" shadow="hover" v-else-if="activeStep === 1">
			<template #header>
				<div class="flex items-center text-xl text-[#1f87e8ff]" v-if="backupStatus === 'loading'">
					<el-icon>
						<WarningFilled />
					</el-icon>
					<span class="ml-1 font-bold">稍等</span>
				</div>
				<div
					class="flex items-center text-xl text-[#2a9a5b]"
					v-else-if="backupStatus === 'success'"
				>
					<el-icon>
						<SuccessFilled />
					</el-icon>
					<span class="ml-1 font-bold">备份完成</span>
				</div>
				<div class="flex items-center text-xl text-[#e04969]" v-else-if="backupStatus === 'fail'">
					<el-icon>
						<CircleCloseFilled />
					</el-icon>
					<span class="ml-1 font-bold">备份失败</span>
				</div>
			</template>
			<el-progress
				:percentage="PROGRESS_STATUS[backupStatus].percentage"
				:color="PROGRESS_STATUS[backupStatus].color"
				:indeterminate="backupStatus === 'loading'"
				:duration="1"
				stroke-width="10"
				class="mt-2"
			>
				<span class="text-xl">
					<el-icon color="#2a9a5b" class="ml-1" v-if="backupStatus === 'success'"
						><Select /></el-icon
					><el-icon color="#1f87e8ff" class="is-loading ml-1" v-else-if="backupStatus === 'loading'"
						><Loading
					/></el-icon>
					<el-icon color="#e04969" class="ml-1" v-else-if="backupStatus === 'fail'"
						><CloseBold
					/></el-icon>
				</span>
			</el-progress>
			<el-button
				class="mt-2"
				color="#e04969"
				plain
				@click="handleShowFailReason"
				v-if="backupStatus === 'fail'"
				>查看原因
			</el-button>
			<template #footer>
				<div class="flex justify-between">
					<el-button type="primary" color="#2a9a5b" @click="handlePrevStep">上一步</el-button>
					<el-button
						type="primary"
						color="#e04969"
						@click="handleCancelBackup"
						v-if="backupStatus === 'loading'"
						>取消
					</el-button>
					<el-tooltip
						effect="dark"
						:content="backupStatus === 'loading' ? '请等待备份完成' : '请重新进行备份'"
						:disabled="backupStatus === 'success'"
					>
						<el-button
							type="primary"
							color="#2a9a5b"
							:disabled="backupStatus !== 'success'"
							@click="
								() => {
									isShowBackupDownloadInfo = true
									isConfirmBackupDownloadInfo = false
								}
							"
							>下载备份
						</el-button>
					</el-tooltip>
				</div>
			</template>
		</el-card>
	</Transition>
</template>

<style scoped>
li {
	margin-bottom: 0.2rem;
}

.el-steps {
	background: none;
}
</style>
