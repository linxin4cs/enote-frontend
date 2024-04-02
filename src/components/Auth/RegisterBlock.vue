<script setup>
import { Lock, Message, EditPen } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import service from '@/utils/request'
import router from '@/utils/router'
import { setUserInfo } from '@/utils/store'
import getRules from '@/utils/validator'

const isEmailValid = ref(false)
const formRef = ref()
const coldDownTime = ref(0)

const form = reactive({
	// username: '',
	password: '',
	passwordAgain: '',
	email: '',
	code: ''
})

function onValidate(prop, isValid) {
	if (prop === 'email') {
		isEmailValid.value = isValid
	}
}

function register() {
	formRef.value.validate((isValid) => {
		if (isValid) {
			service
				.post('/api/auth/register', {
					data: {
						// username: form.username,
						password: form.password,
						email: form.email,
						code: form.code
					}
				})
				.then(() => {
					ElMessage.success('注册成功！')

					service
						.post(
							'/auth/login',
							{
								username: form.email,
								password: form.password,
								remember: true
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

								setUserInfo(userInfo)
								router.push('/')
								ElMessage.success('登录成功')
							})
						})
						.catch((error) => {
							ElMessage.error(error.data.message)
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

function sendCode() {
	service
		.post('/api/auth/send-register-code', {
			data: {
				email: form.email
			}
		})
		.then(() => {
			ElMessage.success('发送成功！')
			coldDownTime.value = 60
			setInterval(() => coldDownTime.value--, 1000)
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
}
</script>

<template>
	<div>
		<h2 class="mb-6 text-2xl text-[#2a9a5b]">注册</h2>
		<el-form
			:model="form"
			:rules="getRules(form)"
			@validate="onValidate"
			ref="formRef"
			class="w-72"
		>
			<!--			<el-form-item prop="username">-->
			<!--				<el-input-->
			<!--					v-model="form.username"-->
			<!--					:maxlength="8"-->
			<!--					placeholder="用户名"-->
			<!--					type="text"-->
			<!--				>-->
			<!--					<template #prefix>-->
			<!--						<el-icon>-->
			<!--							<User />-->
			<!--						</el-icon>-->
			<!--					</template>-->
			<!--				</el-input>-->
			<!--			</el-form-item>-->
			<el-form-item prop="email">
				<el-input v-model="form.email" placeholder="邮箱" type="text">
					<template #prefix>
						<el-icon>
							<Message />
						</el-icon>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input
					:minlength="8"
					:maxlength="20"
					v-model="form.password"
					placeholder="密码"
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
					v-model="form.passwordAgain"
					placeholder="重复密码"
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
				<el-row :gutter="10">
					<el-col :span="15">
						<el-input v-model="form.code" placeholder="验证码" type="text">
							<template #prefix>
								<el-icon>
									<EditPen />
								</el-icon>
							</template>
						</el-input>
					</el-col>
					<el-col :span="5">
						<el-button
							@click="sendCode"
							type="primary"
							color="#2a9a5b"
							:disabled="!isEmailValid || coldDownTime > 0"
							>{{ coldDownTime > 0 ? '请稍后 ' + coldDownTime + '秒' : '获取验证码' }}
						</el-button>
					</el-col>
				</el-row>
			</el-form-item>
		</el-form>
		<el-button @click="register" color="#e6a23cff" plain class="w-24">立即注册</el-button>
		<el-divider>
			<span class="text-gray-400 text-xs">已有账号？</span>
		</el-divider>
		<router-link to="/auth/login">
			<el-button class="w-24" color="#67c23aff" plain>去登录 </el-button>
		</router-link>
	</div>
</template>
