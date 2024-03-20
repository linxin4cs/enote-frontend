<script setup>
import { ref, reactive, computed } from 'vue'
import {
	WarningFilled,
	Edit,
	Loading,
	Select,
	SuccessFilled,
	CircleCloseFilled,
	CloseBold,
	DocumentCopy,
	UploadFilled
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, genFileId } from 'element-plus'

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
	postgresql: 'fail',
	file: 'fail'
})
const isShowBackupUpload = ref(false)
const isConfirmBackupUploadInfo = ref(false)
const uploadRef = ref(null)

// loading, success, fail
const restoreStatus = ref('loading')
const failReason = ref('')

const isAllServicesOnline = computed(() => {
	return serviceStatus.postgresql === 'online' && serviceStatus.file === 'online'
})

function handelRefreshService() {
	serviceStatus.postgresql = 'loading'
	serviceStatus.file = 'loading'

	setTimeout(() => {
		serviceStatus.postgresql = 'online'
		serviceStatus.file = 'online'
	}, 1000)
}

function handleBackupFileExceed(files) {
	const uploadRefValue = uploadRef.value
	if (uploadRefValue) {
		uploadRefValue.clearFiles()
		const file = files[0]
		file.uid = genFileId()
		uploadRefValue.handleStart(file)
	}
}

const beforeBackupUpload = (rawFile) => {
	if (rawFile.type !== '.zip') {
		ElMessage.error('请上传直接从备份页面下载的备份文件')
		return false
	}

	return true
}

function handleRestore() {
	isShowBackupUpload.value = false
	isConfirmBackupUploadInfo.value = false
	activeStep.value = 1

	setTimeout(() => {
		restoreStatus.value = 'loading'
	}, 2000)
}

function handlePrevStep() {
	restoreStatus.value = 'loading'
	activeStep.value = 0
	// TODO 发送取消指令

	handelRefreshService()
}

function handleCancelRestore() {
	ElMessageBox.confirm('确定取消恢复？', '注意', {
		confirmButtonText: '确定',
		cancelButtonText: '取消'
	}).then(() => {
		handlePrevStep()
	})
}

function handleShowFailReason() {
	ElMessageBox.alert('This is a message', 'Title', {
		title: '失败报错',
		autofocus: false,
		message: failReason.value,
		confirmButtonText: '已知晓'
	})
}

handelRefreshService()
</script>

<template>
	<el-dialog v-model="isShowBackupUpload" class="min-w-72 max-w-96">
		<template #header>
			<div class="flex items-center text-xl text-[#e04969]">
				<el-icon><WarningFilled /></el-icon>
				<span class="ml-1 font-bold">注意</span>
			</div>
		</template>

		<span
			>请<span class="text-[#e04969]">直接上传</span>从备份页面下载的备份文件，<span
				class="text-[#e04969]"
				>请勿</span
			>进行分批、解包上传！</span
		>
		<div>
			<el-checkbox v-model="isConfirmBackupUploadInfo">已知晓</el-checkbox>
		</div>
		<el-upload
			class="mt-2"
			drag
			:limit="1"
			:on-exceed="handleBackupFileExceed"
			:auto-upload="true"
			ref="uploadRef"
			accept=".zip"
			:before-upload="beforeBackupUpload"
		>
			<el-icon class="el-icon--upload"><upload-filled /></el-icon>
			<div class="el-upload__text">
				将文件拖放到这或<span class="text-[#2a9a5b]">手动选择</span>
			</div>
		</el-upload>
		<template #footer>
			<el-tooltip
				effect="dark"
				content="请确认已知晓备份文件上传注意事项"
				:disabled="isConfirmBackupUploadInfo"
			>
				<el-button
					type="primary"
					color="#2a9a5b"
					:disabled="!isConfirmBackupUploadInfo"
					@click="handleRestore"
					>恢复</el-button
				>
			</el-tooltip>
		</template>
	</el-dialog>
	<el-steps class="max-w-[480px] el-steps" :active="activeStep" finish-status="success" simple>
		<el-step title="确认" :icon="Edit" />
		<el-step title="恢复" :icon="DocumentCopy" />
	</el-steps>
	<Transition name="el-fade-in-linear" mode="out-in">
		<el-card class="max-w-[480px]" shadow="hover" v-if="activeStep === 0">
			<template #header>
				<div class="flex items-center text-xl text-[#e04969]">
					<el-icon><WarningFilled /></el-icon>
					<span class="ml-1 font-bold">注意</span>
				</div>
			</template>
			<div class="font-bold text-[#e04969]">将会覆盖目标机器旧数据</div>
			<p class="font-bold">恢复清单：</p>
			<ul class="list-disc ml-4 text-gray-600">
				<li>
					postgresql 数据库
					<ul class="list-disc ml-4 text-gray-500">
						<li>所有数据文件（用户、笔记等）</li>
						<li>视图和索引</li>
						<li>事务日志</li>
						<li>等其他文件</li>
					</ul>
				</li>
				<li>
					二进制文件
					<ul class="list-disc ml-4 text-gray-500">
						<li>图像</li>
						<li>视频</li>
						<li>音频</li>
					</ul>
				</li>
			</ul>
			<el-divider border-style="dashed" />
			<p class="font-bold">
				请在恢复前确认本应用如下服务<span class="text-[#e04969]">全部</span>在线：
			</p>
			<ul class="list-disc text-gray-500 ml-0">
				<li class="flex items-center">
					<el-icon color="#2a9a5b" class="mr-0.5" v-if="serviceStatus.postgresql === 'online'"
						><Select
					/></el-icon>
					<el-icon color="#e04969" class="mr-0.5" v-else-if="serviceStatus.postgresql === 'offline'"
						><CloseBold
					/></el-icon>
					<el-icon
						color="#1f87e8ff"
						class="is-loading mr-0.5"
						v-else-if="serviceStatus.postgresql === 'loading'"
						><Loading
					/></el-icon>
					PostgreSQL
				</li>
				<li class="flex items-center">
					<el-icon color="#2a9a5b" class="mr-0.5" v-if="serviceStatus.file === 'online'"
						><Select
					/></el-icon>
					<el-icon color="#e04969" class="mr-0.5" v-else-if="serviceStatus.file === 'offline'"
						><CloseBold
					/></el-icon>
					<el-icon
						color="#1f87e8ff"
						class="is-loading mr-0.5"
						v-else-if="serviceStatus.file === 'loading'"
						><Loading
					/></el-icon>
					文件存储
				</li>
			</ul>
			<template #footer>
				<div class="flex justify-between">
					<el-button type="primary" color="#2a9a5b" plan @click="handelRefreshService"
						>刷新服务</el-button
					>
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
							@click="isShowBackupUpload = true"
							>上传备份</el-button
						>
					</el-tooltip>
				</div>
			</template>
		</el-card>
		<el-card class="max-w-[480px]" shadow="hover" v-else-if="activeStep === 1">
			<template #header>
				<div class="flex items-center text-xl text-[#1f87e8ff]" v-if="restoreStatus === 'loading'">
					<el-icon><WarningFilled /></el-icon>
					<span class="ml-1 font-bold">稍等</span>
				</div>
				<div
					class="flex items-center text-xl text-[#2a9a5b]"
					v-else-if="restoreStatus === 'success'"
				>
					<el-icon><SuccessFilled /></el-icon>
					<span class="ml-1 font-bold">恢复完成</span>
				</div>
				<div class="flex items-center text-xl text-[#e04969]" v-else-if="restoreStatus === 'fail'">
					<el-icon><CircleCloseFilled /></el-icon>
					<span class="ml-1 font-bold">恢复失败</span>
				</div>
			</template>
			<el-progress
				:percentage="PROGRESS_STATUS[restoreStatus].percentage"
				:color="PROGRESS_STATUS[restoreStatus].color"
				:indeterminate="restoreStatus === 'loading'"
				:duration="1"
				stroke-width="10"
				class="mt-2"
			>
				<span class="text-xl">
					<el-icon color="#2a9a5b" class="ml-1" v-if="restoreStatus === 'success'"
						><Select /></el-icon
					><el-icon
						color="#1f87e8ff"
						class="is-loading ml-1"
						v-else-if="restoreStatus === 'loading'"
						><Loading
					/></el-icon>
					<el-icon color="#e04969" class="ml-1" v-else-if="restoreStatus === 'fail'"
						><CloseBold
					/></el-icon>
				</span>
			</el-progress>
			<el-button
				class="mt-2"
				color="#e04969"
				plain
				@click="handleShowFailReason"
				v-if="restoreStatus === 'fail'"
				>查看原因</el-button
			>
			<template #footer>
				<div class="flex justify-between">
					<el-button type="primary" color="#2a9a5b" @click="handlePrevStep">上一步</el-button>
					<el-button
						type="primary"
						color="#e04969"
						@click="handleCancelRestore"
						v-if="restoreStatus === 'loading'"
						>取消</el-button
					>
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
