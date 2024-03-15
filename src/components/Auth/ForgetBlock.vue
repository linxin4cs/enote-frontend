<script setup>
import { reactive, ref } from "vue";
import { EditPen, Message, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const props = defineProps(["pageMode"]);
const pageMode = props.pageMode;

const active = ref(0);
const isEmailValid = ref(false);
const coldDownTime = ref(0);

const formRef1 = ref();
const formRef2 = ref();

const form = reactive({
	email: "",
	password: "",
	passwordAgain: "",
	code: "",
});

const ValidatePasswordAgain = (rule, value, callback) => {
	if (value === "") {
		callback(new Error("请再次输入密码"));
	} else if (value !== form.password) {
		callback(new Error("两次输入密码不一致"));
	} else {
		callback();
	}
};

const rules = {
	email: [
		{
			required: true,
			message: "请输入邮箱地址",
			trigger: ["blur", "change"],
		},
		{
			type: "email",
			message: "请输入合法的邮件地址",
			trigger: ["blur", "change"],
		},
	],
	code: [
		{
			required: true,
			message: "请输入验证码",
			trigger: ["blur", "change"],
		},
	],
	password: [
		{ required: true, message: "请输入密码", trigger: ["change", "blur"] },
		{
			min: 6,
			max: 16,
			message: "长度只能在 6 到 16 之间",
			trigger: ["blur", "change"],
		},
	],
	passwordAgain: [
		{ validator: ValidatePasswordAgain, trigger: ["blur", "change"] },
	],
};

const onValidate = (prop, isValid) => {
	if (prop === "email") {
		isEmailValid.value = isValid;
	}
};

const validateEmail = () => {};

const startReset = () => {
	formRef1.value.validate((valid) => {
		if (valid) {
			/* empty */
		} else {
			ElMessage.warning("请填写完整信息");
		}
	});
};

const doReset = () => {
	formRef2.value.validate((valid) => {
		if (valid) {
			/* empty */
		} else {
			ElMessage.warning("请填写完整信息");
		}
	});
};
</script>

<template>
	<div>
		<el-steps :active="active" finish-status="success" align-center>
			<el-step title="验证电子邮件" />
			<el-step title="重新设定密码" />
		</el-steps>
		<transition name="el-fade-in-linear" mode="out-in">
			<div v-if="active === 0">
				<div class="mt-2 mb-6 text-2xl">重置密码</div>
				<el-form
					:model="form"
					:rules="rules"
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
							<el-col :span="17">
								<el-input
									maxlength="6"
									v-model="form.code"
									placeholder="验证码"
									type="text"
								>
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
									>{{
										coldDownTime > 0
											? "请稍后 " + coldDownTime + "秒"
											: "获取验证码"
									}}
								</el-button>
							</el-col>
						</el-row>
					</el-form-item>
				</el-form>
				<el-button @click="startReset" class="w-28" color="#f56c6cff" plain
					>开始重置密码
				</el-button>
				<el-divider>
					<span class="text-gray-400 text-xs">点错了？</span>
				</el-divider>
				<router-link
					:to="pageMode === 'admin' ? '/admin/auth/login' : '/auth/login'"
				>
					<el-button class="w-28" color="#67c23aff" plain>去登录 </el-button>
				</router-link>
			</div>
		</transition>
		<transition name="el-fade-in-linear" mode="out-in">
			<div v-if="active === 1">
				<div class="mt-2 mb-1 text-2xl">重置密码</div>
				<div class="text-sm text-gray-400 mb-6">
					请填写您的新密码，务必牢记，防止丢失
				</div>
				<el-form
					:model="form"
					:rules="rules"
					@validate="onValidate"
					class="w-72"
					ref="formRef2"
				>
					<el-form-item prop="password">
						<el-input
							:maxlength="16"
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
				</el-form>
				<el-button @click="doReset" class="w-28" type="danger" plain
					>立即重置密码
				</el-button>
				<el-divider>
					<span class="text-gray-400 text-xs">点错了？</span>
				</el-divider>
				<router-link
					:to="pageMode === 'admin' ? '/admin/auth/login' : '/auth/login'"
				>
					<el-button class="w-28" color="#67c23aff" plain>去登录 </el-button>
				</router-link>
			</div>
		</transition>
	</div>
</template>
