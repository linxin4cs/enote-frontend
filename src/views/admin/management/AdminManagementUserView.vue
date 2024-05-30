<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ROLE_LIST, STATUS_LIST } from '@/utils/constant'
import service from '@/utils/request'
import { formatDateTimeToFull } from '@/utils/format'
import getRules from '@/utils/validator'

onMounted(() => {
	fetchUsers()
})

// const users = [
// 	{
// 		id: '0781e07c-336b-48b2-bf19-88084487a733',
// 		name: '一起仗剑走天涯去吧',
// 		email: '1650349707@gmail.com',
// 		status: 1,
// 		role: 1,
// 		createdAt: '2021-08-01 12:00:00'
// 	},
// 	{
// 		id: '1',
// 		name: '企鹅守护者',
// 		email: '1650349707@gmail.com',
// 		status: 1,
// 		role: 2,
// 		createdAt: '2021-08-01 12:00:00'
// 	},
// 	{
// 		id: '1',
// 		name: '张林鑫',
// 		email: '1650349707@gmail.com',
// 		status: 1,
// 		role: 0,
// 		createdAt: '2021-08-01 12:00:00'
// 	},
// 	{
// 		id: '1',
// 		name: '张林鑫',
// 		email: '1650349707@gmail.com',
// 		status: 1,
// 		role: 0,
// 		createdAt: '2021-08-01 12:00:00'
// 	},
// 	{
// 		id: '1',
// 		name: '张林鑫',
// 		email: '1650349707@gmail.com',
// 		status: 1,
// 		role: 0,
// 		createdAt: '2021-08-01 12:00:00'
// 	},
// 	{
// 		id: '1',
// 		name: '张林鑫',
// 		email: '1650349707@gmail.com',
// 		status: 1,
// 		role: 0,
// 		createdAt: '2021-08-01 12:00:00'
// 	},
// 	{
// 		id: '1',
// 		name: '张林鑫',
// 		email: '1650349707@gmail.com',
// 		status: 1,
// 		role: 0,
// 		createdAt: '2021-08-01 12:00:00'
// 	},
// 	{
// 		id: '1',
// 		name: '张林鑫',
// 		email: '1650349707@gmail.com',
// 		status: 1,
// 		role: 0,
// 		createdAt: '2021-08-01 12:00:00'
// 	},
// 	{
// 		id: '1',
// 		name: '张林鑫',
// 		email: '1650349707@gmail.com',
// 		status: 1,
// 		role: 0,
// 		createdAt: '2021-08-01 12:00:00'
// 	},
// 	{
// 		id: '1',
// 		name: '张林鑫',
// 		email: '1650349707@gmail.com',
// 		status: 1,
// 		role: 0,
// 		createdAt: '2021-08-01 12:00:00'
// 	}
// ]
const tableRef = ref(null)
const tableDataLoading = ref(true)
const users = ref([])
const totalItems = ref(1000)
const removeIdList = ref([])
const query = reactive({
	keyword: '',
	dateRange: '',
	currentPage: 1,
	pageSize: 10
})

const dialogFormRef = ref()
const dialogSetting = reactive({
	visible: false,
	type: '',
	title: ''
})

const dialogData = reactive({
	id: '',
	name: '',
	email: '',
	role: '',
	status: '',
	createdAt: '',
	storageUsage: ''
})

const dialogClass = computed(() => {
	if (dialogSetting.type === 'detail') {
		return 'min-w-72 max-w-[40rem]'
	}

	return 'min-w-72 max-w-96'
})

function resetQuery() {
	query.keyword = ''
	query.dateRange = ''
	fetchUsers().then(() => {
		ElMessage.success('重置成功！')
	})
}

function onSearchClick() {
	fetchUsers().then(() => {
		ElMessage.success('搜索成功！')
	})
}

function handleCurrentChange(newPage) {
	query.currentPage = newPage
	fetchUsers()
}

async function fetchUsers() {
	return service
		.post('/api/admin/manage/user/list', {
			data: {
				page: query.currentPage,
				size: query.pageSize,
				query: {
					keyword: query.keyword,
					createdAtStart: query.dateRange[0],
					createdAtEnd: query.dateRange[1]
				}
			}
		})
		.then((res) => {
			const rawUsers = res.data.list
			users.value = rawUsers.map((item) => {
				return {
					id: item.id,
					name: item.name,
					email: item.email,
					status: item.status,
					role: item.role,
					createdAt: formatDateTimeToFull(item.createdAt)
				}
			})

			totalItems.value = res.data.totalItems
			tableDataLoading.value = false
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
			tableDataLoading.value = false
		})
}

function setDialogUserInfo(type, user) {
	dialogData.id = user.id
	dialogData.name = user.name
	dialogData.email = user.email
	dialogData.role = ROLE_LIST[user.role]
	dialogData.status = user.status

	if (type === 'detail') {
		dialogData.createdAt = user.createdAt

		service
			.post('/api/admin/manage/user/usage', {
				data: {
					userId: user.id
				}
			})
			.then((res) => {
				dialogData.storageUsage = res.data.total.parsedSize
			})
			.catch((error) => {
				ElMessage.error(error.data.message)
			})
	}
}

function openDialog(type, user) {
	dialogSetting.visible = true

	if (type === 'edit') {
		dialogSetting.type = 'edit'
		dialogSetting.title = '编辑用户'

		// 根据 id 获取用户信息
		setDialogUserInfo('edit', user)
	} else if (type === 'new') {
		dialogSetting.type = 'new'
		dialogSetting.title = '新增用户'
	} else if (type === 'detail') {
		dialogSetting.type = 'detail'
		dialogSetting.title = '用户详情'

		// 根据 id 获取用户信息
		setDialogUserInfo('detail', user)
	}
}

function saveDialogData() {
	dialogFormRef.value.validate((isValid) => {
		if (isValid) {
			if (dialogSetting.type === 'new') {
				addUser()
			} else if (dialogSetting.type === 'edit') {
				const userList = [...users.value]
				const originalData = userList.find((item) => item.id === dialogData.id)
				if (
					originalData.name === dialogData.name &&
					originalData.email === dialogData.email &&
					originalData.role === ROLE_LIST.indexOf(dialogData.role) &&
					originalData.status === dialogData.status
				) {
					ElMessage.warning('未修改任何信息')
				} else {
					editUser()
				}
			}
		} else {
			ElMessage.warning('请正确填写信息')
		}
	})
}

function addUser() {
	const email = dialogData.email.trim()

	service
		.post('/api/admin/manage/user/new', {
			data: {
				email: email,
				role: ROLE_LIST.indexOf(dialogData.role),
				status: dialogData.status
			}
		})
		.then(() => {
			fetchUsers()
			ElMessage.success('新建成功！')
			dialogSetting.visible = false
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
}

function editUser() {
	const email = dialogData.email.trim()
	const name = dialogData.name.trim()

	service
		.post('/api/admin/manage/user/edit', {
			data: {
				id: dialogData.id,
				newEmail: email,
				newName: name,
				newRole: ROLE_LIST.indexOf(dialogData.role),
				newStatus: dialogData.status
			}
		})
		.then(() => {
			fetchUsers()
			ElMessage.success('修改成功！')
			dialogSetting.visible = false
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
}

function handleDialogClosed() {
	dialogSetting.type = ''
	dialogSetting.title = ''

	dialogData.id = ''
	dialogData.name = ''
	dialogData.email = ''
	dialogData.password = ''
	dialogData.role = ''
	dialogData.status = ''
	dialogData.createdAt = ''
	dialogData.storageUsage = ''
}

function handleSelectionChange(selection) {
	removeIdList.value = selection.map((item) => item.id)
}

function handleDeleteClick(type, row) {
	let message = ''
	if (type === 'selection') {
		message = `确定删除选中的 ${removeIdList.value.length} 个用户？`
	} else if (type === 'single') {
		message = `确定删除用户 "${row.name}" ？`
	}

	ElMessageBox.alert('This is a message', 'Title', {
		title: '注意',
		autofocus: false,
		message: message,
		confirmButtonText: '确定',
		showCancelButton: true,
		cancelButtonText: '取消',
		beforeClose: (action, instance, done) => {
			if (action === 'confirm') {
				if (type === 'selection') {
					deleteUsers(removeIdList.value)
				} else if (type === 'single') {
					deleteUsers([row.id])
				}
			}

			tableRef.value.clearSelection()
			removeIdList.value = []

			done()
		}
	})
}

function deleteUsers(ids) {
	service
		.post('/api/admin/manage/user/delete', {
			data: {
				ids: ids
			}
		})
		.then(() => {
			ElMessage.success('删除成功！')
			fetchUsers()
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
}
</script>

<template>
	<div class="flex flex-col gap-2">
		<div class="flex flex-wrap items-center flex-row gap-2 border rounded p-4">
			<el-input placeholder="ID / 用户名 / 邮箱" class="max-w-48" v-model="query.keyword" />
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
				v-model="query.dateRange"
				class="max-w-64"
			/>
			<div class="flex flex-row items-center">
				<el-button color="#2a9a5b" @click="onSearchClick">搜索</el-button>
				<el-button @click="resetQuery">重置</el-button>
			</div>
		</div>

		<el-card shadow="never">
			<template #header>
				<div class="flex justify-between">
					<div>
						<el-button type="primary" @click="openDialog('new')">新增</el-button>
						<el-button
							type="danger"
							@click="handleDeleteClick('selection')"
							:disabled="removeIdList.length === 0"
							>删除
						</el-button>
					</div>
				</div>
			</template>

			<el-table
				:data="users"
				v-loading="tableDataLoading"
				ref="tableRef"
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="selection" width="28" align="center" />
				<!--				<el-table-column key="id" label="id" align="left" prop="id" width="100">-->
				<!--					<template #default="scope">-->
				<!--						<el-tooltip effect="dark" :content="scope.row.id" placement="top-end">-->
				<!--							<span class="cursor-pointer">{{ scope.row.id.slice(0, 8) + '...' }}</span>-->
				<!--						</el-tooltip>-->
				<!--					</template>-->
				<!--				</el-table-column>-->
				<el-table-column
					key="id"
					label="ID"
					align="left"
					prop="id"
					width="100"
					show-overflow-tooltip
					sortable
				/>
				<el-table-column
					key="name"
					label="用户名"
					align="left"
					prop="name"
					min-width="140"
					show-overflow-tooltip
					sortable
				/>
				<el-table-column
					key="email"
					label="邮箱"
					align="left"
					prop="email"
					min-width="200"
					show-overflow-tooltip
					sortable
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
					:filter-method="(value, row) => row.role === value"
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
						{ text: '启用', value: 1 },
						{ text: '禁用', value: 0 }
					]"
					:filter-method="(value, row) => row.role === value"
				>
					<template #default="scope">
						<el-tag :type="scope.row.status === 0 ? 'info' : 'success'"
							>{{ scope.row.status === 0 ? '禁用' : '启用' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column
					key="createdAt"
					label="创建时间"
					align="left"
					prop="createdAt"
					width="170"
					sortable
				/>
				<el-table-column label="操作" width="138" align="center">
					<template #default="scope">
						<el-button type="success" size="small" link @click="openDialog('detail', scope.row)"
							>详情
						</el-button>
						<el-button type="primary" link size="small" @click="openDialog('edit', scope.row)"
							>编辑
						</el-button>
						<el-button
							type="danger"
							link
							size="small"
							@click="handleDeleteClick('single', scope.row)"
							>删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-pagination
				class="mt-4 ml-[-0.5rem]"
				layout="prev, pager, next"
				v-if="totalItems > 0"
				:total="totalItems"
				@current-change="handleCurrentChange"
				:current-page="query.currentPage"
				:page-size="query.pageSize"
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
		<div v-if="dialogSetting.type === 'new' || dialogSetting.type === 'edit'">
			<el-form
				ref="dialogFormRef"
				label-width="65px"
				:model="dialogData"
				:rules="getRules(dialogData)"
			>
				<el-form-item label="用户名" prop="name" v-if="dialogSetting.type === 'edit'">
					<el-input placeholder="请输入用户名" v-model="dialogData.name" />
				</el-form-item>

				<el-form-item label="邮箱" prop="email">
					<el-input placeholder="请输入邮箱" v-model="dialogData.email" />
				</el-form-item>
				<!--			<el-form-item label="密码" prop="password" v-if="dialogSetting.type === 'new'">-->
				<!--				<el-input placeholder="请输入密码" v-model="dialogData.password" />-->
				<!--			</el-form-item>-->

				<el-form-item label="角色" prop="role" v-if="dialogSetting.type === 'edit'">
					<el-select placeholder="请选择" v-model="dialogData.role">
						<el-option v-for="(item, index) in ROLE_LIST" :key="index" :value="ROLE_LIST[index]" />
					</el-select>
				</el-form-item>

				<el-form-item label="状态" prop="status" v-if="dialogSetting.type === 'edit'">
					<el-radio-group v-model="dialogData.status">
						<el-radio v-for="(item, index) in STATUS_LIST" :key="index" :value="index"
							>{{ item }}
						</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<el-divider v-if="dialogSetting.type === 'new'"></el-divider>
			<div v-if="dialogSetting.type === 'new'">
				<div class="font-bold">以下为默认信息：</div>
				<div class="ml-6 text-gray-500">
					<div>用户名：随机生成</div>
					<div>密码：enotepwd</div>
					<div>角色：普通用户</div>
					<div>状态：禁用</div>
				</div>
			</div>
		</div>
		<!-- 用户新增/编辑/详情表单 -->

		<el-descriptions :column="2" border v-else-if="dialogSetting.type === 'detail'">
			<el-descriptions-item label="id">{{ dialogData.id }}</el-descriptions-item>
			<el-descriptions-item label="用户名"> {{ dialogData.name }}</el-descriptions-item>
			<el-descriptions-item label="邮箱"> {{ dialogData.email }}</el-descriptions-item>
			<el-descriptions-item label="角色"> {{ dialogData.role }}</el-descriptions-item>
			<el-descriptions-item label="状态">
				{{ STATUS_LIST[dialogData.status] }}
			</el-descriptions-item>
			<el-descriptions-item label="创建时间"> {{ dialogData.createdAt }}</el-descriptions-item>
			<el-descriptions-item label="存储用量" v-loading="dialogData.storageUsage === ''">
				{{ dialogData.storageUsage }}
			</el-descriptions-item>
		</el-descriptions>

		<!-- 弹窗底部操作按钮 -->
		<template #footer v-if="dialogSetting.type !== 'detail'">
			<div class="dialog-footer">
				<el-button type="primary" @click="saveDialogData" color="#2a9a5b">确定</el-button>
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
