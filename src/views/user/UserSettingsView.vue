<script setup>
import { ref } from 'vue'
import { EditPen } from '@element-plus/icons-vue'
import service from '@/utils/request'
import { ElMessage } from 'element-plus'
import { toLogin } from '@/utils/router'
import useStore, { resetUserInfo } from '@/utils/store'

const store = useStore()

const isShowDeleteConfirmDialog = ref(false)
const deleteAccountCodeInput = ref('')
const deleteAccountCodeColdDownTime = ref(0)

function sendOldEmailCode() {
	if (store.userInfo.role === 2) {
		ElMessage.error('无法删除超级管理员！')
		return
	}

	service
		.post('/api/settings/delete-account/send-code', {})
		.then(() => {
			ElMessage.success('发送成功！')
			deleteAccountCodeColdDownTime.value = 60
			setInterval(() => deleteAccountCodeColdDownTime.value--, 1000)
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
}

function deleteAccount() {
	service
		.post('/api/settings/delete-account/validate-code', {
			data: {
				code: deleteAccountCodeInput.value
			}
		})
		.then(() => {
			isShowDeleteConfirmDialog.value = false
			deleteAccountCodeInput.value = ''
			ElMessage.success('确认删除，即将退出登录！')
			setTimeout(() => {
				resetUserInfo()
				toLogin()
			}, 1000)
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
}

function handleDeleteAccountDialogClose() {
	deleteAccountCodeInput.value = ''
}
</script>

<template>
	<el-dialog
		v-model="isShowDeleteConfirmDialog"
		title="删除账号"
		style="width: 20rem"
		@closed="handleDeleteAccountDialogClose"
	>
		<div class="mb-4">为了防止误操作，如确实需要删除本账号，请在下面的输入框中输入邮箱验证码</div>
		<div class="flex justify-between items-center w-full">
			<el-input v-model="deleteAccountCodeInput" class="max-w-44" placeholder="请输入验证码">
				<template #prefix>
					<el-icon>
						<EditPen />
					</el-icon>
				</template>
			</el-input>
			<el-button
				type="primary"
				color="#2a9a5b"
				@click="sendOldEmailCode"
				:disabled="deleteAccountCodeColdDownTime > 0"
				>{{
					deleteAccountCodeColdDownTime > 0
						? '请稍后 ' + deleteAccountCodeColdDownTime + '秒'
						: '发送验证码'
				}}
			</el-button>
		</div>
		<template #footer>
			<div class="dialog-footer">
				<el-button type="warning" @click="isShowDeleteConfirmDialog = false">取消</el-button>
				<el-button
					type="danger"
					@click="deleteAccount"
					:disabled="deleteAccountCodeInput.length === 0"
					>确定
				</el-button>
			</div>
		</template>
	</el-dialog>
	<h2 class="text-3xl text-[#2a9a5b]">设置</h2>
	<el-button type="danger" plain class="my-4" @click="isShowDeleteConfirmDialog = true"
		>删除账号
	</el-button>
	<div class="max-w-96">
		<div class="font-bold text-xl text-red-500 mb-2">注意：</div>
		<span
			>一旦确认删除账号，登录状态自动失效，本账号的所有数据将<span
				class="text-red-500 underline decoration-4 decoration-wavy"
				>立即</span
			>进行删除操作，<span class="text-red-500 underline decoration-4 decoration-wavy"
				>无法撤回</span
			>，请谨慎操作！</span
		>
	</div>
</template>

<style scoped></style>
