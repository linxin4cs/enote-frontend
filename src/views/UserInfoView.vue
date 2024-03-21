<script setup>
import { ref } from 'vue'

import defaultAvatar from '@/assets/default_avatar.png'
import { ElMessage } from 'element-plus'
import { User, Message, Lock } from '@element-plus/icons-vue'

const avatarUploadVisible = ref(false)
const avatar = ref([])

function handleSaveEdit() {
	ElMessage({
		showClose: true,
		message: '保存成功',
		type: 'success'
	})
}
</script>

<template>
	<el-dialog v-model="avatarUploadVisible" class="min-w-72 max-w-80">
		<template #header>
			<span class="font-bold text-xl">上传头像</span>
		</template>
		<el-upload
			v-model:file-list="fileList"
			:before-remove="beforeRemove"
			:limit="1"
			:on-exceed="handleExceed"
			:auto-upload="false"
			:show-file-list="false"
		>
			<el-button type="primary">选择头像</el-button>
			<template #tip>
				<div class="el-upload__tip">jpg / jpeg / png / webp 文件，大小小于 4 MB。</div>
			</template>
		</el-upload>
		<el-image class="w-full aspect-video mt-2" v-if="avatar.length !== 0" fit="contain" />
		<div
			class="w-full aspect-video mt-2 flex items-center justify-center box-border border-2 text-lg text-gray-400"
			v-else
		>
			暂无图片
		</div>
		<template #footer>
			<el-tooltip
				v-model="avatar"
				effect="dark"
				content="请上传头像"
				:show-file-list="false"
				:disabled="avatar.length !== 0"
			>
				<el-button type="primary" color="#2a9a5b" :disabled="avatar.length === 0">确定</el-button>
			</el-tooltip>
		</template>
	</el-dialog>
	<div class="flex flex-wrap gap-2">
		<el-card class="pb-6" shadow="hover">
			<template #header>
				<div class="card-header flex justify-between items-center">
					<span class="text-lg font-bold">个人信息</span>
					<span
						class="text-xs border-[1px] text-[#2a9a5b] border-[#2a9a5b] rounded-sm p-1 shadow-md"
						>超级管理员</span
					>
				</div>
			</template>
			<template #default>
				<div class="flex justify-center">
					<div class="avatar h-32 w-32 relative cursor-pointer" @click="avatarUploadVisible = true">
						<el-image
							class="h-32 w-32 rounded-full"
							fit="cover"
							:src="userInfo?.avatarUrl || defaultAvatar"
						/>
					</div>
				</div>
				<el-divider />
				<div class="text-[#4a4b4eff]">
					<div class="flex justify-between">
						<span class="mr-10">用户名</span>
						<span>张林鑫</span>
					</div>
					<el-divider />
					<div class="flex justify-between">
						<span class="mr-10">邮箱</span>
						<span>1650349707@qq.com</span>
					</div>
				</div>
			</template>
		</el-card>
		<el-card shadow="hover">
			<el-tabs stretch class="mt-[-0.5rem]">
				<el-tab-pane>
					<template #label> <span class="hover:text-[#2a9a5b] text-lg">修改信息</span> </template>
					<el-form label-width="auto" class="min-w-[14.5rem] max-w-64">
						<el-form-item required>
							<el-input placeholder="请输入用户名">
								<template #prefix>
									<el-icon>
										<User />
									</el-icon>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item required>
							<el-input placeholder="请输入邮箱">
								<template #prefix>
									<el-icon>
										<Message />
									</el-icon>
								</template>
							</el-input>
						</el-form-item>
					</el-form>
				</el-tab-pane>
				<el-tab-pane>
					<template #label> <span class="hover:text-[#2a9a5b] text-lg">修改信息</span></template>
					<el-form label-width="auto" class="max-w-64">
						<el-form-item required>
							<el-input placeholder="旧密码">
								<template #prefix>
									<el-icon>
										<Lock />
									</el-icon>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item required>
							<el-input placeholder="新密码">
								<template #prefix>
									<el-icon>
										<Lock />
									</el-icon>
								</template>
							</el-input>
						</el-form-item>
						<el-form-item required>
							<el-input placeholder="确认新密码">
								<template #prefix>
									<el-icon>
										<Lock />
									</el-icon>
								</template>
							</el-input>
						</el-form-item>
					</el-form>
				</el-tab-pane>
			</el-tabs>
			<el-divider style="margin-top: -0.2rem" />
			<div class="text-right">
				<el-button color="#2a9a5b" @click="handleSaveEdit">保存</el-button>
			</div>
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
