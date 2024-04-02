<script setup>
import { reactive, ref } from 'vue'
import { EditPen, Message, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import service from '@/utils/request'
import { toLogin } from '@/utils/router'
import getRules from '@/utils/validator'

const props = defineProps(['pageMode'])
const pageMode = props.pageMode

const active = ref(0)
const isEmailValid = ref(false)
const coldDownTime = ref(0)

const formRef1 = ref()
const formRef2 = ref()

const form = reactive({
	email: '',
	password: '',
	passwordAgain: '',
	code: ''
})

function onValidate(prop, isValid) {
	if (prop === 'email') {
		isEmailValid.value = isValid
	}
}

function sendCode() {
	service
		.post('/api/auth/send-reset-code', {
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

function validateResetCode() {
	formRef1.value.validate((valid) => {
		if (valid) {
			service
				.post('/api/auth/validate-reset-code', {
					data: {
						email: form.email,
						code: form.code
					}
				})
				.then(() => {
					active.value++
				})
				.catch((error) => {
					ElMessage.error(error.data.message)
				})
		} else {
			ElMessage.warning('请填写完整信息')
		}
	})
}

function resetPassword() {
	formRef2.value.validate((valid) => {
		if (valid) {
			service
				.post('/api/auth/reset-password', {
					data: {
						password: form.password
					}
				})
				.then(() => {
					ElMessage.success('重置成功')

					if (pageMode === 'admin') {
						toLogin('admin')
						return
					}

					toLogin()
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
	<div>
		<el-steps :active="active" finish-status="success" align-center>
			<el-step title="验证电子邮件" :icon="Message" />
			<el-step title="重新设定密码" :icon="Lock" />
		</el-steps>
		<transition name="el-fade-in-linear" mode="out-in">
			<div v-if="active === 0">
				<div class="mt-2 mb-6 text-2xl">重置密码</div>
				<el-form
					:model="form"
					:rules="getRules(form)"
					@validate="onValidate"
					ref="formRef1"
					class="w-72"
				>
					<el-form-item prop="email">
						<el-input v-model="form.email" placeholder="邮箱" type="text">
							<template #prefix>
								<el-icon>
									<Message />
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
				<el-button @click="validateResetCode" class="w-28" color="#f56c6cff" plain
					>开始重置密码
				</el-button>
				<el-divider>
					<span class="text-gray-400 text-xs">点错了？</span>
				</el-divider>
				<router-link :to="pageMode === 'admin' ? '/admin/auth/login' : '/auth/login'">
					<el-button class="w-28" color="#67c23aff" plain>去登录 </el-button>
				</router-link>
			</div>
			<div v-else-if="active === 1">
				<div class="mt-2 mb-1 text-2xl">重置密码</div>
				<div class="text-sm text-gray-400 mb-6">请填写您的新密码，务必牢记，防止丢失</div>
				<el-form
					:model="form"
					:rules="getRules(form)"
					@validate="onValidate"
					class="w-72"
					ref="formRef2"
				>
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
				</el-form>
				<el-button @click="resetPassword" class="w-28" type="danger" plain>立即重置密码 </el-button>
				<el-divider>
					<span class="text-gray-400 text-xs">点错了？</span>
				</el-divider>
				<router-link :to="pageMode === 'admin' ? '/admin/auth/login' : '/auth/login'">
					<el-button class="w-28" color="#67c23aff" plain>去登录 </el-button>
				</router-link>
			</div>
		</transition>
	</div>
</template>
