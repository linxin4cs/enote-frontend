<script setup>
import { Lock, Message, EditPen } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

const form = reactive({
	// username: '',
	password: '',
	passwordAgain: '',
	email: '',
	code: ''
})

const validateUsername = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请输入用户名'))
	} else if (!/^[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
		callback(new Error('用户名只能包中文、英文和数字'))
	} else {
		callback()
	}
}

const ValidatePasswordAgain = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请再次输入密码'))
	} else if (value !== form.password) {
		callback(new Error('两次输入密码不一致'))
	} else {
		callback()
	}
}

const rules = {
	username: [
		{ validator: validateUsername, trigger: ['blur', 'change'] },
		{
			min: 3,
			max: 8,
			message: '长度只能在 3 到 8 之间',
			trigger: ['blur', 'change']
		}
	],
	password: [
		{ required: true, message: '请输入密码', trigger: ['change', 'blur'] },
		{
			min: 6,
			max: 16,
			message: '长度只能在 6 到 16 之间',
			trigger: ['blur', 'change']
		}
	],
	passwordAgain: [{ validator: ValidatePasswordAgain, trigger: ['blur', 'change'] }],
	email: [
		{
			required: true,
			message: '请输入邮箱地址',
			trigger: ['blur', 'change']
		},
		{
			type: 'email',
			message: '请输入合法的邮件地址',
			trigger: ['blur', 'change']
		}
	],
	code: [
		{
			required: true,
			message: '请输入验证码',
			trigger: ['blur', 'change']
		}
	]
}

const isEmailValid = ref(false)
const formRef = ref()
const coldDownTime = ref(0)

const onValidate = (prop, isValid) => {
	if (prop === 'email') {
		isEmailValid.value = isValid
	}
}

const register = () => {
	formRef.value.validate((isValid) => {
		if (isValid) {
			/* empty */
		} else {
			ElMessage.warning('请填写完整信息')
		}
	})
}

const validateEmail = () => {}
</script>

<template>
	<div>
		<h2 class="mb-6 text-2xl text-[#2a9a5b]">注册</h2>
		<el-form :model="form" :rules="rules" @validate="onValidate" ref="formRef" class="w-72">
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
				<el-input :maxlength="16" v-model="form.password" placeholder="密码" type="password">
					<template #prefix>
						<el-icon>
							<Lock />
						</el-icon>
					</template>
				</el-input>
			</el-form-item>
			<el-form-item prop="passwordAgain">
				<el-input
					maxlength="16"
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
					<el-col :span="17">
						<el-input maxlength="6" v-model="form.code" placeholder="验证码" type="text">
							<template #prefix>
								<el-icon>
									<EditPen />
								</el-icon>
							</template>
						</el-input>
					</el-col>
					<el-col :span="5">
						<el-button
							@click="validateEmail"
							color="#67c23aff"
							:disabled="!isEmailValid || coldDownTime > 0"
							>{{ coldDownTime > 0 ? '请稍后 ' + coldDownTime + '秒' : '获取验证码' }}
						</el-button>
					</el-col>
				</el-row>
			</el-form-item>
		</el-form>
		<el-button @click="register" color="#e6a23cff" plain class="w-24">立即注册 </el-button>
		<el-divider>
			<span class="text-gray-400 text-xs">已有账号？</span>
		</el-divider>
		<router-link to="/auth/login">
			<el-button class="w-24" color="#67c23aff" plain>去登录 </el-button>
		</router-link>
	</div>
</template>
