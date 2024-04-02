<script setup>
import { ref, reactive, computed } from 'vue'

import defaultAvatar from '@/assets/default_avatar.png'
import { User, Message, Lock, EditPen } from '@element-plus/icons-vue'
import useStore, { setUserInfo } from '@/utils/store'
import { formatDate } from '@/utils/format'
import { PICTURE_TYPE_LIST, ROLE_LIST } from '@/utils/constant'
import getRules from '@/utils/validator'
import service from '@/utils/request'
import { ElMessage, genFileId } from 'element-plus'

const store = useStore()

const tabActive = ref('info')
const infoFormRef = ref()
const emailFormRef = ref()
const passwordFormRef = ref()
const isEmailValid = ref(false)
const oldEmailColdDownTime = ref(0)
const newEmailColdDownTime = ref(0)

const AVATAR_UPLOAD_STATUS = {
	READY: 'ready',
	UPLOADING: 'uploading',
	SUCCESS: 'success',
	ERROR: 'error'
}

const infoForm = reactive({
	name: store.userInfo.name
})

const emailForm = reactive({
	email: store.userInfo.email,
	oldEmailCode: '',
	newEmailCode: ''
})

const passwordForm = reactive({
	password: '',
	passwordAgain: '',
	code: ''
})

const avatarUrl = computed(() => {
	if (store.userInfo.avatar === '' || store.userInfo.avatar === null) {
		return defaultAvatar
	}

	return store.userInfo.avatar
})

const avatarUploadDialogVisible = ref(false)
const avatarUploadRef = ref()
const avatarUploadList = ref([])
const avatarUploadStatus = ref(AVATAR_UPLOAD_STATUS.READY)
const avatarUploadPreview = computed(() => {
	if (avatarUploadList.value.length === 0) {
		return avatarUrl.value
	}

	return URL.createObjectURL(avatarUploadList.value[0].raw)
})

function openAvatarUploadDialog() {
	avatarUploadDialogVisible.value = true
}

function handleAvatarUploadDialogClose() {
	avatarUploadRef.value.clearFiles()
	avatarUploadRef.value.abort()
	avatarUploadStatus.value = AVATAR_UPLOAD_STATUS.READY
}

function beforeAvatarUpload(rawFile) {
	if (PICTURE_TYPE_LIST.indexOf(rawFile.type) === -1) {
		ElMessage.error('只能上传 jpg / jpeg / png / webp 文件')
		return false
	} else if (rawFile.size / 1024 / 1024 > 4) {
		ElMessage.error('图片大小不能超过 4 MB')
		return false
	}
	return true
}

function handleAvatarUploadExceed(files) {
	avatarUploadRef.value.clearFiles()
	const file = files[0]
	file.uid = genFileId()
	avatarUploadRef.value.handleStart(file)
}

function handleAvatarUploadSuccess(res) {
	ElMessage.success('上传成功！')
	store.userInfo.avatar = res.data.data.avatar
	avatarUploadStatus.value = AVATAR_UPLOAD_STATUS.SUCCESS
	avatarUploadDialogVisible.value = false
}

function handleAvatarUploadError() {
	avatarUploadStatus.value = AVATAR_UPLOAD_STATUS.ready
	ElMessage.error('上传失败！')
}

function handleAvatarUploadProgress() {
	avatarUploadStatus.value = AVATAR_UPLOAD_STATUS.UPLOADING
}

function saveAvatar() {
	avatarUploadRef.value.abort()
	avatarUploadRef.value.submit()
}

function handleTabChange(tab) {
	if (tab === 'info') {
		infoForm.name = store.userInfo.name
	} else if (tab === 'email') {
		emailForm.email = store.userInfo.email
		emailForm.oldEmailCode = ''
		emailForm.newEmailCode = ''
	} else if (tab === 'password') {
		passwordForm.password = ''
		passwordForm.passwordAgain = ''
		passwordForm.code = ''
	}
}

function onValidateEmailForm(prop, isValid) {
	if (prop === 'email') {
		isEmailValid.value = isValid
	}
}

function handleSaveInfo() {
	infoFormRef.value.validate((isValid) => {
		if (isValid) {
			service
				.post('/api/user/edit/info', {
					data: {
						name: infoForm.name
					}
				})
				.then(() => {
					ElMessage.success('修改成功！')
					setUserInfo({
						...store.userInfo,
						name: infoForm.name
					})
				})
				.catch((error) => {
					ElMessage.error(error.data.message)
				})
		} else {
			ElMessage.warning('请填写完整信息')
		}
	})
}

function sendOldEmailCode() {
	service
		.post('/api/user/edit/email/send-code/old', {})
		.then(() => {
			ElMessage.success('发送成功！')
			oldEmailColdDownTime.value = 60
			setInterval(() => oldEmailColdDownTime.value--, 1000)
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
}

function sendNewEmailCode() {
	service
		.post('/api/user/edit/email/send-code/new', {
			data: {
				email: emailForm.email
			}
		})
		.then(() => {
			ElMessage.success('发送成功！')
			newEmailColdDownTime.value = 60
			setInterval(() => newEmailColdDownTime.value--, 1000)
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
}

function handleSaveEmail() {
	emailFormRef.value.validate((isValid) => {
		if (isValid) {
			service
				.post('/api/user/edit/email/validate-code', {
					data: {
						oldEmailCode: emailForm.oldEmailCode,
						newEmail: emailForm.email,
						newEmailCode: emailForm.newEmailCode
					}
				})
				.then(() => {
					ElMessage.success('修改成功！')
					setUserInfo({
						...store.userInfo,
						email: emailForm.email
					})
					emailForm.oldEmailCode = ''
					emailForm.newEmailCode = ''
				})
				.catch((error) => {
					ElMessage.error(error.data.message)
				})
		} else {
			ElMessage.warning('请填写完整信息')
		}
	})
}

function sendPasswordCode() {
	service
		.post('/api/user/edit/password/send-code', {})
		.then(() => {
			ElMessage.success('发送成功！')
			oldEmailColdDownTime.value = 60
			setInterval(() => oldEmailColdDownTime.value--, 1000)
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
}
function handleSavePassword() {
	passwordFormRef.value.validate((isValid) => {
		if (isValid) {
			service
				.post('/api/user/edit/password/validate-code', {
					data: {
						password: passwordForm.password,
						code: passwordForm.code
					}
				})
				.then(() => {
					ElMessage.success('修改成功！')
					passwordForm.password = ''
					passwordForm.passwordAgain = ''
					passwordForm.code = ''
				})
				.catch((error) => {
					ElMessage.error(error.data.message)
				})
		} else {
			ElMessage.warning('请填写完整信息')
		}
	})
}
</script>

<template>
	<el-dialog
		v-model="avatarUploadDialogVisible"
		class="min-w-72 max-w-80"
		:on-close="handleAvatarUploadDialogClose"
	>
		<template #header>
			<span class="font-bold text-xl">上传头像</span>
		</template>
		<el-upload
			action="/api/user/edit/avatar"
			v-model:file-list="avatarUploadList"
			:limit="1"
			:before-upload="beforeAvatarUpload"
			:auto-upload="false"
			:show-file-list="false"
			:on-exceed="handleAvatarUploadExceed"
			:on-success="handleAvatarUploadSuccess"
			:on-error="handleAvatarUploadError"
			:on-progress="handleAvatarUploadProgress"
			ref="avatarUploadRef"
			accept="image/jpeg,image/jpg,image/png,image/webp"
			name="files"
			with-credentials
		>
			<el-button type="primary">选择图片</el-button>
			<template #tip>
				<div class="el-upload__tip">jpg / jpeg / png / webp 文件，大小小于 4 MB。</div>
			</template>
		</el-upload>
		<el-image class="w-full aspect-video mt-2" :src="avatarUploadPreview" fit="contain" />
		<!--		<el-image class="w-full aspect-video mt-2" v-if="avatarUploadList.length !== 0" fit="contain" />-->
		<!--		<div-->
		<!--			class="w-full aspect-video mt-2 flex items-center justify-center box-border border-2 text-lg text-gray-400"-->
		<!--			v-else-->
		<!--		>-->
		<!--			请上传图片-->
		<!--		</div>-->
		<template #footer>
			<el-tooltip
				v-model="avatarUploadList"
				effect="dark"
				:content="
					avatarUploadStatus === AVATAR_UPLOAD_STATUS.UPLOADING
						? '上传中，请等待'
						: '请选择一张图片'
				"
				:show-file-list="false"
				:disabled="
					!(avatarUploadList.length === 0 || avatarUploadStatus === AVATAR_UPLOAD_STATUS.UPLOADING)
				"
			>
				<el-button
					type="primary"
					color="#2a9a5b"
					:disabled="
						avatarUploadList.length === 0 || avatarUploadStatus === AVATAR_UPLOAD_STATUS.UPLOADING
					"
					@click="saveAvatar"
					>{{
						avatarUploadStatus === AVATAR_UPLOAD_STATUS.UPLOADING ? '上传中' : '确定'
					}}</el-button
				>
			</el-tooltip>
		</template>
	</el-dialog>
	<div class="flex flex-wrap gap-2 items-start">
		<el-card class="pb-6" shadow="hover">
			<template #header>
				<div class="card-header flex justify-between items-center">
					<span class="text-lg font-bold">个人信息</span>
					<span
						class="text-xs border-[1px] text-[#2a9a5b] border-[#2a9a5b] rounded-sm p-1 shadow-md"
						>{{ ROLE_LIST[store.userInfo.role] }}</span
					>
				</div>
			</template>
			<template #default>
				<div class="flex justify-center">
					<div class="avatar h-32 w-32 relative cursor-pointer" @click="openAvatarUploadDialog">
						<el-image class="h-32 w-32 rounded-full" fit="cover" :src="avatarUrl" />
					</div>
				</div>
				<el-divider />
				<div class="text-[#4a4b4eff]">
					<div class="flex justify-between">
						<span class="mr-12">ID</span>
						<span>{{ store.userInfo.id }}</span>
					</div>
					<el-divider />
					<div class="flex justify-between">
						<span class="mr-12">用户名</span>
						<span>{{ store.userInfo.name }}</span>
					</div>
					<el-divider />
					<div class="flex justify-between">
						<span class="mr-12">邮箱</span>
						<span>{{ store.userInfo.email }}</span>
					</div>
					<el-divider />
					<div class="flex justify-between">
						<span class="mr-12">创建于</span>
						<span>{{ formatDate(store.userInfo.createdAt) }}</span>
					</div>
				</div>
			</template>
		</el-card>
		<el-card shadow="hover">
			<el-tabs stretch class="mt-[-0.5rem]" v-model="tabActive" @tabChange="handleTabChange">
				<el-tab-pane name="info">
					<template #label> <span class="hover:text-[#2a9a5b] text-lg">修改信息</span> </template>
					<el-form
						label-width="auto"
						:model="infoForm"
						:rules="getRules(infoForm)"
						ref="infoFormRef"
					>
						<el-form-item prop="name">
							<el-input :minlength="2" :maxlength="16" placeholder="用户名" v-model="infoForm.name">
								<template #prefix>
									<el-icon>
										<User />
									</el-icon>
								</template>
							</el-input>
						</el-form-item>
					</el-form>
					<el-divider style="margin-top: -0.2rem" />
					<div class="text-right">
						<el-tooltip
							effect="dark"
							:content="
								infoForm.name === ''
									? '新信息不能为空'
									: infoForm.name === store.userInfo.name
										? '新信息不能与原信息相同'
										: ''
							"
							:disabled="!(infoForm.name === store.userInfo.name || infoForm.name === '')"
						>
							<el-button
								color="#2a9a5b"
								@click="handleSaveInfo"
								:disabled="infoForm.name === store.userInfo.name || infoForm.name === ''"
								>保存</el-button
							>
						</el-tooltip>
					</div>
				</el-tab-pane>
				<el-tab-pane name="email">
					<template #label> <span class="hover:text-[#2a9a5b] text-lg">修改邮箱</span> </template>
					<el-form
						label-width="auto"
						:model="emailForm"
						:rules="getRules(emailForm)"
						@validate="onValidateEmailForm"
						ref="emailFormRef"
					>
						<el-form-item prop="email">
							<el-input placeholder="新邮箱" v-model="emailForm.email">
								<template #prefix>
									<el-icon>
										<Message />
									</el-icon>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="oldEmailCode">
							<div class="flex justify-between items-center w-full">
								<el-input
									v-model="emailForm.oldEmailCode"
									class="max-w-44"
									placeholder="原邮箱验证码"
								>
									<template #prefix>
										<el-icon>
											<EditPen />
										</el-icon>
									</template>
								</el-input>
								<el-tooltip
									effect="dark"
									:content="emailForm.email === '' ? '新邮箱不能为空' : '新邮箱不能与原邮箱相同'"
									:disabled="!(emailForm.email === store.userInfo.email || emailForm.email === '')"
								>
									<el-button
										type="primary"
										color="#2a9a5b"
										@click="sendOldEmailCode"
										:disabled="
											!isEmailValid ||
											oldEmailColdDownTime > 0 ||
											emailForm.email === store.userInfo.email
										"
										>{{
											oldEmailColdDownTime > 0 ? '请稍后 ' + oldEmailColdDownTime + '秒' : '原邮箱'
										}}
									</el-button>
								</el-tooltip>
							</div>
						</el-form-item>
						<el-form-item prop="newEmailCode">
							<div class="flex justify-between items-center w-full">
								<el-input
									v-model="emailForm.newEmailCode"
									class="max-w-44"
									placeholder="新邮箱验证码"
								>
									<template #prefix>
										<el-icon>
											<EditPen />
										</el-icon>
									</template>
								</el-input>
								<el-tooltip
									effect="dark"
									:content="emailForm.email === '' ? '新邮箱不能为空' : '新邮箱不能与原邮箱相同'"
									:disabled="!(emailForm.email === store.userInfo.email || emailForm.email === '')"
								>
									<el-button
										type="primary"
										color="#2a9a5b"
										@click="sendNewEmailCode"
										:disabled="
											!isEmailValid ||
											newEmailColdDownTime > 0 ||
											emailForm.email === store.userInfo.email ||
											!isEmailValid
										"
										>{{
											newEmailColdDownTime > 0 ? '请稍后 ' + newEmailColdDownTime + '秒' : '新邮箱'
										}}
									</el-button>
								</el-tooltip>
							</div>
						</el-form-item>
					</el-form>
					<el-divider style="margin-top: -0.2rem" />
					<div class="text-right">
						<el-tooltip
							effect="dark"
							:content="
								emailForm.email === ''
									? '新邮箱不能为空'
									: emailForm.email === store.userInfo.email
										? '新邮箱不能与原邮箱相同'
										: emailForm.oldEmailCode === '' || emailForm.newEmailCode === ''
											? '验证码不能为空'
											: ''
							"
							:disabled="
								!(
									emailForm.email === '' ||
									emailForm.email === store.userInfo.email ||
									emailForm.oldEmailCode === '' ||
									emailForm.newEmailCode === ''
								)
							"
						>
							<el-button
								color="#2a9a5b"
								@click="handleSaveEmail"
								:disabled="
									emailForm.email === '' ||
									emailForm.email === store.userInfo.email ||
									emailForm.oldEmailCode === '' ||
									emailForm.newEmailCode === ''
								"
								>保存</el-button
							>
						</el-tooltip>
					</div>
				</el-tab-pane>
				<el-tab-pane name="password">
					<template #label> <span class="hover:text-[#2a9a5b] text-lg">修改密码</span></template>
					<el-form
						label-width="auto"
						:model="passwordForm"
						:rules="getRules(passwordForm)"
						ref="passwordFormRef"
					>
						<el-form-item prop="password">
							<el-input
								:minlength="8"
								:maxlength="20"
								placeholder="新密码"
								v-model="passwordForm.password"
								type="password"
							>
								<template #prefix>
									<el-icon>
										<Lock />
									</el-icon>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="passwordAgain">
							<el-input
								:minlength="8"
								:maxlength="20"
								placeholder="重复新密码"
								v-model="passwordForm.passwordAgain"
								type="password"
							>
								<template #prefix>
									<el-icon>
										<Lock />
									</el-icon>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item prop="code">
							<div class="flex justify-between items-center w-full">
								<el-input v-model="passwordForm.code" class="max-w-44" placeholder="验证码">
									<template #prefix>
										<el-icon>
											<EditPen />
										</el-icon>
									</template>
								</el-input>
								<el-tooltip
									effect="dark"
									:content="
										passwordForm.password === ''
											? '新密码不能为空'
											: passwordForm.password !== passwordForm.passwordAgain
												? '两次密码不一致'
												: ''
									"
									:disabled="
										!(
											passwordForm.password === '' ||
											passwordForm.password !== passwordForm.passwordAgain
										)
									"
								>
									<el-button
										type="primary"
										color="#2a9a5b"
										@click="sendPasswordCode"
										:disabled="
											oldEmailColdDownTime > 0 ||
											passwordForm.password === '' ||
											passwordForm.password !== passwordForm.passwordAgain
										"
										>{{
											oldEmailColdDownTime > 0
												? '请稍后 ' + oldEmailColdDownTime + '秒'
												: '获取验证码'
										}}
									</el-button>
								</el-tooltip>
							</div>
						</el-form-item>
					</el-form>
					<el-divider style="margin-top: -0.2rem" />
					<div class="text-right">
						<el-tooltip
							effect="dark"
							:content="passwordForm.password === '' ? '新密码不能为空' : '验证码不能为空'"
							:disabled="!(passwordForm.password === '' || passwordForm.code === '')"
						>
							<el-button
								color="#2a9a5b"
								@click="handleSavePassword"
								:disabled="passwordForm.password === '' || passwordForm.code === ''"
								>保存</el-button
							>
						</el-tooltip>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<style scoped>
.avatar {
	position: relative;
}

.avatar::after {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	width: 100%;
	height: 100%;
	font-size: 50px;
	color: #fff;
	background-color: rgba(0, 0, 0, 0.2);
	border-radius: 50%;
	content: '+';
	opacity: 0;
	justify-content: center;
	align-items: center;
}

.avatar:hover::after {
	opacity: 1;
}
</style>
