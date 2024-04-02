<script setup>
import { Lock, Message } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import service from '@/utils/request'
import router, { toLogin } from '@/utils/router'
import { setUserInfo } from '@/utils/store'

const props = defineProps(['pageMode'])
const pageMode = props.pageMode

const form = reactive({
	username: '',
	password: '',
	remember: false
})

function login() {
	if (!form.username || !form.password) {
		ElMessage.warning('请填写用户名和密码！')
	} else {
		service
			.post(
				'/api/auth/login',
				{
					username: form.username,
					password: form.password,
					remember: form.remember
				},
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
					}
				}
			)
			.then(() => {
				service.get('/api/user/me').then((res) => {
					const userInfo = res.data

					if (pageMode === 'admin') {
						if (userInfo.role === 1 || userInfo.role === 2) {
							setUserInfo(userInfo)
							router.push('/admin/dashboard')
							ElMessage.success('登录成功')
							return
						} else if (userInfo.role === 0) {
							toLogin()
							ElMessage.error('没有管理员权限')
							return
						}
					}

					setUserInfo(userInfo)
					router.push('/')
					ElMessage.success('登录成功')
				})
			})
			.catch((error) => {
				ElMessage.error(error.data.message)
			})
	}
}
</script>

<template>
	<div>
		<h2 class="mb-6 text-2xl text-[#2a9a5b]">
			<RouterLink to="/">ENote</RouterLink><span v-if="pageMode === 'admin'"> 后台管理</span
			><span v-else-if="pageMode === 'user'"> 云笔记</span>
		</h2>
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
