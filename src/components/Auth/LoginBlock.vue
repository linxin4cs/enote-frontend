<script setup>
import { Lock, Message } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps(['pageMode'])
const pageMode = props.pageMode

const form = reactive({
	username: '',
	password: '',
	remember: false
})

const login = () => {
	if (!form.username || !form.password) {
		ElMessage.warning('请填写用户名和密码！')
	} else {
		/* empty */
	}
}
</script>

<template>
	<div>
		<h2 class="mb-6 text-2xl text-[#2a9a5b]"><RouterLink to="/">ENote</RouterLink> 后台管理</h2>
		<!--		<div>测试内容</div>-->
		<div class="w-72 mb-2">
			<el-input v-model="form.username" type="text" placeholder="邮箱">
				<template #prefix>
					<el-icon>
						<Message />
					</el-icon>
				</template>
			</el-input>
		</div>
		<div class="w-72">
			<el-input v-model="form.password" type="password" placeholder="密码">
				<template #prefix>
					<el-icon>
						<Lock />
					</el-icon>
				</template>
			</el-input>
		</div>

		<div class="m-2 w-72 mx-auto flex items-center justify-between">
			<el-checkbox v-model="form.remember" label="记住我" />
			<router-link :to="pageMode === 'admin' ? '/admin/auth/forget' : '/auth/forget'" class="flex">
				<el-link>忘记密码?</el-link>
			</router-link>
		</div>
		<el-button @click="login" class="w-24" color="#67c23aff" plain> 登录 </el-button>
		<div v-if="pageMode === 'user'" class="flex flex-col items-center">
			<el-divider>
				<span class="text-xs text-gray-400">没有账号？</span>
			</el-divider>
			<RouterLink to="/auth/register">
				<el-button class="w-24" color="#e6a23cff" plain>注册账号 </el-button>
			</RouterLink>
		</div>
	</div>
</template>
