<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { DeleteOne } from '@icon-park/vue-next'
import { useRoute } from 'vue-router'
import { Refresh, Search } from '@element-plus/icons-vue'
import service from '@/utils/request'
import useStore from '@/utils/store'

const props = defineProps({
	disabled: {
		type: Boolean,
		default: true
	},
	currentFolder: {
		type: Object,
		default: () => ({
			id: '',
			name: '',
			userId: '',
			createdAt: '',
			noteCount: 0
		})
	},
	handleSearch: {
		type: Function,
		default: () => {}
	},
	handleReset: {
		type: Function,
		default: () => {}
	}
})

const query = useStore().asideInfo.query

const route = useRoute()
const isShowSearchFloat = ref(false)
const searchHistory = ref(['搜索历史1', '搜索历史2'])

const page = computed(() => {
	return route.fullPath.split('/')[1]
})

const placeholderText = computed(() => {
	const list = route.fullPath.split('/')

	if (list[1] === 'latest') {
		return '搜索笔记'
	} else if (list[1] === 'folder') {
		return '搜索文件夹'
	} else if (list[1] === 'star') {
		return '搜索笔记'
	} else if (list[1] === 'tag') {
		if (list[2] === undefined) {
			return '搜索标签'
		}

		return '搜索笔记'
	}

	return '搜索笔记'
})

function handleFocus() {
	query.searchScope = 1

	service('/api/search/history').then((res) => {
		let keywords = res.data?.keywords ?? []

		// updatedAtInstant 降序排序, updatedAtInstant 为搜索时间, 格式为：2224-04-27T08:08:03.031Z
		keywords.sort((a, b) => {
			return new Date(b.updatedAtInstant) - new Date(a.updatedAtInstant)
		})

		searchHistory.value = keywords

		isShowSearchFloat.value = true
	})
}

function deleteSearchHistory(event) {
	event.stopPropagation() // 阻止事件冒泡
	service.delete('/api/search/history').then(() => {
		searchHistory.value = []
	})
}

const handleClickOutside = (event) => {
	// 指向 Vue 组件的根元素
	const el = document.querySelector('.relative')
	// 如果点击的区域不是组件内部，关闭浮动框
	if (!el.contains(event.target)) {
		isShowSearchFloat.value = false

		searchHistory.value = []
	}
}

onMounted(() => {
	window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
	window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
	<div class="relative">
		<div class="flex items-center justify-between gap-2">
			<el-input
				:placeholder="placeholderText"
				v-model="query.keyword"
				@focus="handleFocus"
				clearable
				:disabled="props.disabled"
			/>
			<div class="flex items-center rounded-md border" v-if="props.disabled">
				<div class="flex items-center justify-center cursor-no-drop py-[0.30rem] px-1 bg-gray-100">
					<span class="text-[#a9abb2ff]">Aa</span>
				</div>
				<div class="flex items-center justify-center cursor-no-drop py-[0.35rem] px-1 bg-gray-100">
					<el-icon color="#a9abb2ff" size="22">
						<Search />
					</el-icon>
				</div>
				<div class="flex items-center justify-center cursor-no-drop py-[0.35rem] px-1 bg-gray-100">
					<el-icon color="#a9abb2ff" size="22">
						<Refresh />
					</el-icon>
				</div>
			</div>
			<div class="flex items-center rounded-md border" v-else>
				<el-tooltip content="大小写匹配">
					<div
						:class="
							query.isCaseSensitive
								? 'flex items-center justify-center cursor-pointer py-[0.3rem] px-1 bg-gray-100 text-[#2a9a5b]'
								: 'flex items-center justify-center cursor-pointer py-[0.3rem] px-1 hover:bg-gray-100 text-[#a9abb2ff]'
						"
						@click="query.isCaseSensitive = query.isCaseSensitive === 1 ? 0 : 1"
					>
						Aa
					</div>
				</el-tooltip>
				<el-tooltip :content="query.keyword === '' ? '请输入关键词' : '搜索'">
					<div
						class="flex items-center justify-center cursor-pointer py-[0.35rem] px-1 hover:bg-gray-100"
						v-if="query.keyword !== ''"
					>
						<el-icon color="#a9abb2ff" size="22">
							<Search
								@click="
									() => {
										isShowSearchFloat = false
										handleSearch()
									}
								"
							/>
						</el-icon>
					</div>
					<div
						class="flex items-center justify-center cursor-no-drop py-[0.35rem] px-1 bg-gray-100"
						v-else
					>
						<el-icon color="#a9abb2ff" size="22">
							<Search />
						</el-icon>
					</div>
				</el-tooltip>
				<el-tooltip content="重置">
					<div
						class="flex items-center justify-center cursor-pointer py-[0.35rem] px-1 hover:bg-gray-100"
					>
						<el-icon color="#a9abb2ff" size="22">
							<Refresh @click="handleReset" />
						</el-icon>
					</div>
				</el-tooltip>
			</div>
		</div>

		<div
			class="flex flex-col w-11/12 bg-white shadow-md rounded absolute mt-2 border p-3 z-10"
			v-if="isShowSearchFloat && (page === 'folder' || searchHistory.length !== 0)"
		>
			<div
				class="flex flex-row items-center justify-between mb-1"
				v-if="searchHistory.length !== 0"
			>
				<span class="text-sm text-[#7a8599ff]">最近搜索</span>
				<delete-one
					theme="outline"
					size="18"
					fill="#9b9b9b"
					class="cursor-pointer"
					@click="deleteSearchHistory($event)"
				/>
			</div>
			<div class="flex flex-row flex-wrap gap-1">
				<span
					class="bg-[#f1f3f5ff] px-1 rounded-lg cursor-pointer text-[#7a8599ff] hover:bg-[#dff0e7] text-sm whitespace-nowrap overflow-hidden text-ellipsis"
					v-for="(item, index) in searchHistory"
					@click="
						() => {
							isShowSearchFloat = false
							query.keyword = item.content
							handleSearch()
						}
					"
					:key="index"
					>{{ item.content }}</span
				>
			</div>
			<div
				class="h-[1px] bg-gray-300 my-2"
				v-if="
					!(searchHistory.length === 0 || page === 'latest' || page === 'star' || page === 'tag')
				"
			/>
			<div class="flex flex-row items-center justify-between" v-if="page === 'folder'">
				<span class="text-sm text-[#7a8599ff]">范围</span>
			</div>
			<el-radio-group v-model="query.searchScope" v-if="page === 'folder'">
				<div class="flex flex-row flex-wrap">
					<el-radio :value="1">当前文件夹</el-radio>
					<el-radio :value="0">所有文件夹</el-radio>
				</div>
			</el-radio-group>
		</div>
	</div>
</template>

<style scoped></style>
