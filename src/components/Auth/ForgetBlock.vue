<script setup>
import { reactive, ref } from "vue";
import { EditPen, Message, Lock } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import router from "@/router";

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
		<div style="margin: 30px 20px">
			<el-steps :active="active" finish-status="success" align-center>
				<el-step title="验证电子邮件" />
				<el-step title="重新设定密码" />
			</el-steps>
		</div>
		<transition name="el-fade-in-linear" mode="out-in">
			<div
				style="margin: 20px; text-align: center; height: 100%"
				v-if="active === 0"
			>
				<div style="margin-top: 80px; height: 100%">
					<div style="font-size: 25px">重置密码</div>
					<div style="font-size: 14px; color: grey">
						请输入需要重置密码的电子邮件
					</div>
					<div style="margin-top: 50px">
						<el-form
							:model="form"
							:rules="rules"
							@validate="onValidate"
							ref="formRef1"
						>
							<el-form-item prop="email">
								<el-input
									v-model="form.email"
									placeholder="请输入邮箱"
									type="email"
								>
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
											placeholder="请输入验证码"
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
											style=""
											type="success"
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
					</div>
					<div style="margin-top: 70px">
						<el-button
							@click="startReset"
							style="width: 270px"
							type="danger"
							plain
							>开始重置密码
						</el-button>
					</div>
					<el-divider>
						<span style="color: grey; font-size: 13px">点错了？</span>
					</el-divider>
					<div>
						<el-button
							@click="
								(evt) => {
									router.push('/auth');
								}
							"
							style="width: 270px"
							type="success"
							plain
							>去登录
						</el-button>
					</div>
				</div>
			</div>
		</transition>
		<transition name="el-fade-in-linear" mode="out-in">
			<div
				style="margin: 20px; text-align: center; height: 100%"
				v-if="active === 1"
			>
				<div style="margin-top: 80px">
					<div style="font-size: 25px">重置密码</div>
					<div style="font-size: 14px; color: grey">
						请填写您的新密码，务必牢记，防止丢失
					</div>
				</div>
				<div style="margin-top: 50px">
					<el-form
						:model="form"
						:rules="rules"
						@validate="onValidate"
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
				</div>
				<div style="margin-top: 70px">
					<el-button @click="doReset" style="width: 270px" type="danger" plain
						>立即重置密码
					</el-button>
				</div>
				<el-divider>
					<span style="color: grey; font-size: 13px">点错了？</span>
				</el-divider>
				<div>
					<el-button
						@click="
							(evt) => {
								router.push('/auth');
							}
						"
						style="width: 270px"
						type="success"
						plain
						>去登录
					</el-button>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped></style>
