<script setup>
import { reactive, ref, computed } from 'vue'
import { ElMessageBox } from 'element-plus'

const ROLE_LIST = ['普通用户', '管理员', '超级管理员']
const STATUS_LIST = ['禁用', '启用']

const users = [
	{
		uid: '0781e07c-336b-48b2-bf19-88084487a733',
		username: '一起仗剑走天涯去吧',
		email: '1650349707@gmail.com',
		status: 1,
		role: 1,
		createdTime: '2021-08-01 12:00:00'
	},
	{
		uid: '1',
		username: '企鹅守护者',
		email: '1650349707@gmail.com',
		status: 1,
		role: 2,
		createdTime: '2021-08-01 12:00:00'
	},
	{
		uid: '1',
		username: '张林鑫',
		email: '1650349707@gmail.com',
		status: 1,
		role: 0,
		createdTime: '2021-08-01 12:00:00'
	},
	{
		uid: '1',
		username: 'admin',
		email: '1650349707@gmail.com',
		status: 0,
		role: 0,
		createdTime: '2021-08-01 12:00:00'
	}
]

const tableRef = ref(null)
const total = ref(1000)
const removeUids = ref([])
const queryConditions = reactive({
	keyword: '',
	status: '',
	role: '',
	dateRange: '',
	pageNum: 1,
	pageSize: 10
})
const dialogSetting = reactive({
	visible: false,
	type: '',
	title: ''
})

const dialogData = reactive({
	uid: '',
	username: '',
	email: '',
	password: '',
	role: '',
	status: '',
	createdTime: '',
	storageUsage: ''
})

const dialogClass = computed(() => {
	if (dialogSetting.type === 'detail') {
		return 'min-w-72 max-w-[42rem]'
	}

	return 'min-w-72 max-w-96'
})

function getDialogUserInfo(type, uid) {
	const index = users.findIndex((item) => item.uid === uid)
	dialogData.uid = uid
	dialogData.username = users[index].username
	dialogData.email = users[index].email
	dialogData.role = ROLE_LIST[users[index].role]
	dialogData.status = STATUS_LIST[users[index].status]

	if (type === 'detail') {
		dialogData.createdTime = users[index].createdTime
		dialogData.storageUsage = '149.53 MB'
	}
}

function openDialog(type, uid) {
	dialogSetting.visible = true

	if (type === 'edit') {
		dialogSetting.type = 'edit'
		dialogSetting.title = '编辑用户'

		// 根据 uid 获取用户信息
		getDialogUserInfo('edit', uid)
	} else if (type === 'new') {
		dialogSetting.type = 'new'
		dialogSetting.title = '新增用户'
	} else if (type === 'detail') {
		dialogSetting.type = 'detail'
		dialogSetting.title = '用户详情'

		// 根据 uid 获取用户信息
		getDialogUserInfo('detail', uid)
	}
}

function handleDialogClosed() {
	dialogSetting.type = ''
	dialogSetting.title = ''

	dialogData.uid = ''
	dialogData.username = ''
	dialogData.email = ''
	dialogData.password = ''
	dialogData.role = ''
	dialogData.status = ''
	dialogData.createdTime = ''
	dialogData.storageUsage = ''
}

function handleSelectionChange(selection) {
	removeUids.value = selection.map((item) => item.uid)
}

function handleDelete(type, row) {
	let message = ''
	if (type === 'selection') {
		message = `确定删除选中的 ${removeUids.value.length} 个用户？`
	} else if (type === 'single') {
		message = `确定删除用户 "${row.username}" ？`
	}

	ElMessageBox.alert('This is a message', 'Title', {
		title: '注意',
		autofocus: false,
		message: message,
		confirmButtonText: '确定',
		showCancelButton: true,
		cancelButtonText: '取消'
	})
}
</script>

<template>
	<div class="flex flex-col gap-2">
		<div class="flex flex-wrap items-center flex-row gap-2 border rounded p-4">
			<el-input
				placeholder="UID / 用户名 / 邮箱"
				class="max-w-48"
				v-model="queryConditions.keyword"
			/>
			<!--			<el-select placeholder="全部" class="max-w-20" v-model="queryConditions.status">-->
			<!--				<el-option label="启用" value="1" />-->
			<!--				<el-option label="禁用" value="0" />-->
			<!--			</el-select>-->
			<!--			<el-select placeholder="全部" class="max-w-32" v-model="queryConditions.role">-->
			<!--				<el-option label="普通用户" value="1" />-->
			<!--				<el-option label="管理员" value="0" />-->
			<!--				<el-option label="超级管理员" value="2" />-->
			<!--			</el-select>-->
			<el-date-picker
				type="daterange"
				range-separator="~"
				start-placeholder="开始时间"
				end-placeholder="截止时间"
				value-format="YYYY-MM-DD"
				v-model="queryConditions.dateRange"
				class="max-w-64"
			/>
			<div class="flex flex-row items-center">
				<el-button color="#2a9a5b">搜索</el-button>
				<el-button>重置</el-button>
			</div>
		</div>

		<el-card shadow="never">
			<template #header>
				<div class="flex justify-between">
					<div>
						<el-button type="primary" @click="openDialog('new')">新增</el-button>
						<el-button
							type="danger"
							@click="handleDelete('selection')"
							:disabled="removeUids.length === 0"
							>删除</el-button
						>
					</div>
				</div>
			</template>

			<el-table :data="users" ref="tableRef" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="28" align="center" />
				<!--				<el-table-column key="uid" label="UID" align="left" prop="uid" width="100">-->
				<!--					<template #default="scope">-->
				<!--						<el-tooltip effect="dark" :content="scope.row.uid" placement="top-end">-->
				<!--							<span class="cursor-pointer">{{ scope.row.uid.slice(0, 8) + '...' }}</span>-->
				<!--						</el-tooltip>-->
				<!--					</template>-->
				<!--				</el-table-column>-->
				<el-table-column
					key="uid"
					label="UID"
					align="left"
					prop="uid"
					width="100"
					show-overflow-tooltip
				/>
				<el-table-column
					key="username"
					label="用户名"
					align="left"
					prop="username"
					min-width="140"
					show-overflow-tooltip
				/>
				<el-table-column
					key="email"
					label="邮箱"
					align="left"
					prop="email"
					min-width="200"
					show-overflow-tooltip
				/>

				<el-table-column
					label="角色"
					align="center"
					prop="role"
					width="100"
					:filters="[
						{ text: '普通用户', value: 0 },
						{ text: '管理员', value: 1 },
						{ text: '超级管理员', value: 2 }
					]"
				>
					<template #default="scope">
						{{ ROLE_LIST[scope.row.role] }}
					</template>
				</el-table-column>
				<el-table-column
					label="状态"
					align="center"
					prop="status"
					width="70"
					:filters="[
						{ text: '活跃', value: 1 },
						{ text: '禁用', value: 0 }
					]"
				>
					<template #default="scope">
						<el-tag :type="scope.row.status === 0 ? 'info' : 'success'">{{
							scope.row.status === 0 ? '禁用' : '启用'
						}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column
					key="createdTime"
					label="创建时间"
					align="left"
					prop="createdTime"
					width="170"
				/>
				<el-table-column label="操作" width="138" align="center">
					<template #default="scope">
						<el-button type="success" size="small" link @click="openDialog('detail', scope.row.uid)"
							>详情</el-button
						>
						<el-button type="primary" link size="small" @click="openDialog('edit', scope.row.uid)"
							>编辑</el-button
						>
						<el-button type="danger" link size="small" @click="handleDelete('single', scope.row)"
							>删除</el-button
						>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination
				class="mt-4 ml-[-0.5rem]"
				layout="prev, pager, next"
				v-if="total > 0"
				v-model:total="total"
				v-model:page="queryConditions.pageNum"
				v-model:limit="queryConditions.pageSize"
			/>
		</el-card>
	</div>
	<!-- 弹窗 -->
	<el-dialog
		:class="dialogClass"
		v-model="dialogSetting.visible"
		:title="dialogSetting.title"
		@closed="handleDialogClosed"
		destroy-on-close
	>
		<!-- 用户新增/编辑表单 -->
		<el-form
			ref="userFormRef"
			label-width="55px"
			v-model="dialogData"
			v-if="dialogSetting.type === 'new' || dialogSetting.type === 'edit'"
		>
			<el-form-item label="用户名" prop="username">
				<el-input placeholder="请输入用户名" v-model="dialogData.username" />
			</el-form-item>

			<el-form-item label="邮箱" prop="email" required>
				<el-input placeholder="请输入邮箱" v-model="dialogData.email" />
			</el-form-item>
			<el-form-item label="密码" prop="password" v-if="dialogSetting.type === 'new'">
				<el-input placeholder="请输入密码" v-model="dialogData.password" />
			</el-form-item>

			<el-form-item label="角色" prop="role" required>
				<el-select placeholder="请选择" v-model="dialogData.role">
					<el-option v-for="(item, index) in ROLE_LIST" :key="index" :label="item" :value="item" />
				</el-select>
			</el-form-item>

			<el-form-item label="状态" prop="status">
				<el-radio-group v-model="dialogData.status">
					<el-radio v-for="(item, index) in STATUS_LIST" :key="index" :value="index">{{
						item
					}}</el-radio>
				</el-radio-group>
			</el-form-item>
		</el-form>

		<el-descriptions :column="2" border v-else-if="dialogSetting.type === 'detail'">
			<el-descriptions-item label="UID">{{ dialogData.uid }} </el-descriptions-item>
			<el-descriptions-item label="用户名"> {{ dialogData.username }} </el-descriptions-item>
			<el-descriptions-item label="邮箱"> {{ dialogData.email }} </el-descriptions-item>
			<el-descriptions-item label="角色"> {{ dialogData.role }} </el-descriptions-item>
			<el-descriptions-item label="状态">
				{{ dialogData.status }}
			</el-descriptions-item>
			<el-descriptions-item label="创建时间"> {{ dialogData.createdTime }} </el-descriptions-item>
			<el-descriptions-item label="存储用量"> {{ dialogData.storageUsage }} </el-descriptions-item>
		</el-descriptions>

		<!-- 弹窗底部操作按钮 -->
		<template #footer v-if="dialogSetting.type !== 'detail'">
			<div class="dialog-footer">
				<el-button type="primary">确定</el-button>
				<el-button @click="dialogSetting.visible = false">取消</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<style>
@media screen and (max-width: 768px) {
	.el-picker-panel__sidebar {
		width: 100%;
	}
	.el-picker-panel {
		width: 350px !important;
	}
	.el-picker-panel__content {
		width: 100%;
	}
	.el-picker-panel__body {
		margin-left: 0 !important;
		display: flex;
		flex-direction: column;
		min-width: auto !important;
	}
	.el-picker-panel__sidebar {
		position: relative;
	}
	.el-picker-panel__body-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
}
</style>
