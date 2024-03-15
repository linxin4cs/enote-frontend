<script setup>
import { Lock, User } from "@element-plus/icons-vue";
import { reactive } from "vue";
import { ElMessage } from "element-plus";
import router from "@/router";

const props = defineProps(["mode"]);

const form = reactive({
	username: "",
	password: "",
	remember: false,
});

const login = () => {
	if (!form.username || !form.password) {
		ElMessage.warning("请填写用户名和密码！");
	} else {
		/* empty */
	}
};

console.log(props.mode);
</script>

<template>
	<div class="text-center">
		<h2 class="mb-6 text-2xl">登录</h2>
		<!--		<div>测试内容</div>-->
		<div class="w-70 mt-2">
			<el-input v-model="form.username" type="text" placeholder="邮箱">
				<template #prefix>
					<el-icon>
						<User />
					</el-icon>
				</template>
			</el-input>
		</div>
		<div class="w-70 mt-2">
			<el-input v-model="form.password" type="password" placeholder="密码">
				<template #prefix>
					<el-icon>
						<Lock />
					</el-icon>
				</template>
			</el-input>
		</div>

		<div class="m-2 max-w-60 mx-auto flex items-center justify-between">
			<el-checkbox v-model="form.remember" label="记住我" />
			<router-link to="/auth/forget" class="flex">
				<el-link>忘记密码?</el-link>
			</router-link>
		</div>
		<el-button @click="login" class="w-20" type="success" plain>
			登录
		</el-button>
		<div v-if="props.mode === 'admin'" class="flex flex-col items-center">
			<el-divider>
				<span class="text-xs text-gray-400">没有账号？</span>
			</el-divider>
			<el-button
				@click="
					(evt) => {
						router.push('/admin/auth/register');
					}
				"
				class="w-20"
				type="warning"
				plain
				>注册账号
			</el-button>
		</div>
	</div>
</template>

<style scoped></style>
