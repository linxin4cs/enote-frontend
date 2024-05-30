<template>
	<div
		v-loading="isLoading"
		class="flex flex-row h-full w-full gap-2 items-start flex-wrap xl:flex-nowrap overflow-hidden"
	>
		<div
			class="w-full xl:min-w-80 xl:max-w-80 border rounded flex flex-col px-4 py-2 box-border"
			v-if="isShowOutline"
		>
			<el-collapse v-model="activeOutline">
				<el-collapse-item title="Consistency" name="1">
					<template #title>
						<div class="text-lg text-gray-600 font-bold">大纲</div>
					</template>
					<el-divider />
					<el-scrollbar always>
						<div v-if="tableOfContents.length > 0" class="table-of-contents pb-6">
							<!-- 目录内容 -->
							<ul class="list-none pl-0">
								<li
									v-for="(item, index) in tableOfContents"
									:key="item.id"
									:style="{ paddingLeft: index !== 0 ? (item.level - 1) * 30 + 'px' : '0' }"
									class="text-gray-600 cursor-pointer"
								>
									{{ item.text }}
								</li>
							</ul>
						</div>
					</el-scrollbar>
					<el-empty description="暂无大纲" v-if="tableOfContents.length === 0" />
				</el-collapse-item>
			</el-collapse>
		</div>
		<div class="flex flex-col min-h-full max-h-full w-full overflow-hidden">
			<div class="flex flex-row items-center border py-2 px-4 rounded-t justify-between flex-wrap">
				<el-tooltip :content="store.currentNote.title">
					<div
						class="text-2xl whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer max-w-[40rem] mr-auto"
					>
						{{ store.currentNote.title }}
					</div>
				</el-tooltip>

				<div class="flex flex-row items-center gap-1 flex-wrap">
					<div class="flex flex-row items-center flex-nowrap gap-1 mr-2" v-if="modifiedTime !== ''">
						<link-cloud theme="outline" size="20" fill="#acb4c1" />
						<close
							theme="outline"
							size="16"
							fill="#e04969"
							:stroke-width="6"
							v-if="!isSaveSuccess"
						/>
						<div class="text-nowrap text-[#e04969] text-sm" v-if="!isSaveSuccess && isInit">
							保存失败
						</div>
						<div class="text-nowrap text-[#acb4c1] text-sm" v-if="!isAutoSaving && !isManualSaving">
							更新于 {{ store.currentNote.modifiedTime }}
						</div>
						<div class="text-nowrap text-[#acb4c1] text-sm" v-else>
							{{ isAutoSaving ? '自动' : '' }}保存中...
						</div>
					</div>
					<el-divider direction="vertical" />
					<el-tooltip content="刷新">
						<refresh
							theme="outline"
							size="24"
							fill="#626E85"
							class="cursor-pointer p-1 hover:bg-gray-100 rounded"
							@click="handleRefresh"
						/>
					</el-tooltip>
					<el-tooltip content="只读模式" v-if="!isDisabled">
						<preview-open
							theme="outline"
							size="24"
							fill="#626E85"
							class="cursor-pointer p-1 hover:bg-gray-100 rounded"
							@click="handleOpenReadonly"
						/>
					</el-tooltip>
					<el-tooltip content="编辑模式" v-if="isDisabled">
						<EditorIcon
							theme="outline"
							size="24"
							fill="#626E85"
							class="cursor-pointer p-1 hover:bg-gray-100 rounded"
							@click="handleOpenEdit"
						/>
					</el-tooltip>
					<el-tooltip content="保存" v-if="!isDisabled">
						<save
							theme="outline"
							size="24"
							fill="#626E85"
							:class="'cursor-pointer p-1 hover:bg-gray-100 rounded'"
							@click="handleManualSave"
						/>
					</el-tooltip>

					<el-tooltip content="大纲">
						<mindmap-list
							theme="outline"
							size="24"
							:fill="isShowOutline ? '#2a9a5b' : '#626E85'"
							:class="
								isShowOutline
									? 'cursor-pointer p-1 bg-gray-200 rounded'
									: 'cursor-pointer p-1 hover:bg-gray-100 rounded'
							"
							@click="handleShowOutline"
						/>
					</el-tooltip>
					<el-divider direction="vertical" />
					<div class="flex flex-row rounded-md border">
						<div
							class="text-nowrap text-[#626E85] px-1 cursor-pointer hover:bg-gray-100 border-r"
							@click="handleRename"
						>
							重命名
						</div>
						<div
							class="text-nowrap text-[#626E85] px-1 cursor-pointer hover:bg-gray-100"
							@click="handleMove"
						>
							移动
						</div>
					</div>
					<el-divider direction="vertical" />
					<el-tooltip :content="store.currentNote.stared === 1 ? '取消收藏 ' : '收藏'">
						<star-one
							theme="outline"
							size="24"
							:fill="store.currentNote.stared === 1 ? '#fec433ff' : '#626E85'"
							class="cursor-pointer p-1 hover:bg-gray-100 rounded"
							@click="handleStar"
						/>
					</el-tooltip>
					<el-tooltip content="删除">
						<delete-one
							theme="outline"
							size="24"
							fill="#626E85"
							class="cursor-pointer p-1 hover:bg-gray-100 rounded"
							@click="handleDelete"
						/>
					</el-tooltip>
					<el-tooltip content="更多信息">
						<info
							theme="outline"
							size="24"
							fill="#626E85"
							class="cursor-pointer p-1 hover:bg-gray-100 rounded"
							@click="props.handleMoreInfo"
						/>
					</el-tooltip>
					<el-divider direction="vertical" />
					<el-tooltip content="查找">
						<find
							theme="outline"
							size="24"
							:fill="isShowFind ? '#2a9a5b' : '#626E85'"
							:class="
								isShowFind
									? 'cursor-pointer p-1 bg-gray-200 rounded'
									: 'cursor-pointer p-1 hover:bg-gray-100 rounded'
							"
							@click="
								() => {
									if (isShowFind) {
										handleCloseFind()
									} else {
										isShowFind = true
									}
								}
							"
						/>
					</el-tooltip>
				</div>
			</div>

			<div
				id="ed33"
				style="
					border: 1px solid #e5e7ebff;
					border-top: none;
					display: flex;
					flex-direction: column;
					flex-grow: 1;
				"
			>
				<Toolbar
					:editor="editorRef"
					:defaultConfig="toolbarConfig"
					:mode="mode"
					style="border-bottom: 1px solid #e5e7ebff"
				/>
				<Editor
					:defaultConfig="editorConfig"
					:mode="mode"
					v-model="valueHtml"
					:style="{ height: scrollHeight + 'px' }"
					@onCreated="handleCreated"
					@onChange="handleChange"
					@onBlur="handleBlur"
					@customAlert="customAlert"
				/>
				<!--				<el-scrollbar :max-height="scrollHeight"> </el-scrollbar>-->
			</div>

			<div
				class="flex flex-row items-center py-2 px-4 border rounded-b border-t-0 gap-2"
				v-if="isShowFind"
			>
				<el-tooltip content="大小写匹配">
					<div
						:class="
							query.isCaseSensitive
								? 'flex items-center justify-center cursor-pointer py-1 px-2 bg-gray-100 text-[#2a9a5b] rounded'
								: 'flex items-center justify-center cursor-pointer py-1 px-2 hover:bg-gray-100 text-[#a9abb2ff] rounded'
						"
						@click="query.isCaseSensitive = !query.isCaseSensitive"
					>
						Aa
					</div>
				</el-tooltip>
				<el-input
					v-model="query.keyword"
					style="flex-grow: 1"
					placeholder="请输入关键词查找"
					autofocus
					clearable
					:on-change="
						() => {
							query.isHighlighting = false
						}
					"
				>
					<template #append>0</template>
				</el-input>

				<div class="flex items-center rounded-md border">
					<el-tooltip v-if="query.keyword === ''" content="请输入关键词">
						<search-icon
							theme="outline"
							size="18"
							fill="#a9abb2ff"
							:strokeWidth="6"
							class="cursor-no-drop py-[0.4rem] px-2 bg-gray-100 rounded-l"
						/>
					</el-tooltip>

					<search-icon
						theme="outline"
						size="18"
						fill="#a9abb2ff"
						:strokeWidth="6"
						class="cursor-pointer py-[0.4rem] px-2 hover:bg-gray-100 rounded-l"
						v-else
					/>
					<close
						theme="outline"
						size="18"
						fill="#a9abb2ff"
						:strokeWidth="6"
						class="cursor-pointer py-[0.4rem] px-2 hover:bg-gray-100 rounded-r"
						@click="handleCloseFind"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css'
import { computed, onBeforeUnmount, onMounted, reactive, ref, shallowRef, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import {
	Close,
	DeleteOne,
	Editor as EditorIcon,
	Find,
	Info,
	LinkCloud,
	MindmapList,
	PreviewOpen,
	Refresh,
	Save,
	Search as SearchIcon,
	StarOne
} from '@icon-park/vue-next'
import { ElInput, ElMessage } from 'element-plus'
import useStore, { resetCurrentNote } from '@/utils/store'
import service from '@/utils/request'
import { useRoute, useRouter } from 'vue-router'
import { DomEditor } from '@wangeditor/editor'

const props = defineProps([
	'handleRename',
	'handleMove',
	'handleStar',
	'handleDelete',
	'handleMoreInfo'
])

const isMobile = computed(() => {
	const userAgent = navigator.userAgent
	return /iPhone|iPad|iPod|Android/i.test(userAgent)
})

const scrollHeight = computed(() => {
	if (isMobile.value) {
		return window.innerHeight - 180 - 160
	}

	return window.innerHeight - 180
})

const store = useStore()
const query = reactive({ keyword: '', isCaseSensitive: false, isHighlighting: false })

const route = useRoute()
const router = useRouter()
const currentNoteId = computed(() => {
	const page = route.fullPath.split('/')[1]

	if (page === 'latest') {
		return route.fullPath.split('/')[3]
	} else if (page === 'folder') {
		return route.fullPath.split('/')[2] === 'note'
			? route.fullPath.split('/')[3]
			: route.fullPath.split('/')[4]
	} else if (page === 'star') {
		return route.fullPath.split('/')[3]
	} else if (page === 'tag') {
		return route.fullPath.split('/')[4]
	}

	return null
})

const mode = ref('default')

// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef()
const toolbar = DomEditor.getToolbar(editorRef.value)

const title = ref('')
const modifiedTime = ref('')
const stared = ref(0)
// 内容 HTML
const valueHtml = ref('')
const tableOfContents = ref([])
const oldHtml = ref('')

const toolbarConfig = {
	excludeKeys: ['redo', 'undo']
}
const editorConfig = {
	placeholder: '请输入内容...',
	readOnly: true,
	MENU_CONF: {
		uploadImage: {
			server: '/api/file/image/' + currentNoteId.value,
			maxFileSize: 10 * 1024 * 1024,
			allowedFileTypes: ['image/*'],
			withCredentials: true,

			maxNumberOfFiles: 1,

			onProgress(progress) {
				// ElMessage.info('上传中，请等待')
				console.log('上传进度：' + progress)
			},

			onSuccess(file, res) {
				saveContent()
					.then(() => {
						isAutoSaving.value = false
						isManualSaving.value = true
						ElMessage.success('上传成功')
					})
					.finally(() => {
						isManualSaving.value = false
					})
			},

			onFailed(file, res) {},

			onError(file, err, res) {
				// JS 语法
				if (err.message.includes('timeout')) {
					ElMessage.error('上传超时，请重试')
				} else if (err.message.includes('size')) {
					ElMessage.error('图片大小不能超过10MB')
				} else if (err.message === 'Upload error') {
					ElMessage.error('上传失败，请重试')
				} else {
					ElMessage.error(err.message)
				}
			}
		},
		uploadVideo: {
			server: '/api/file/video/' + currentNoteId.value,
			maxFileSize: 512 * 1024 * 1024,
			allowedFileTypes: ['video/*', 'audio/*'],
			withCredentials: true,

			maxNumberOfFiles: 1,

			onProgress(progress) {
				// ElMessage.info('上传中，请等待')
				console.log('上传进度：' + progress)
			},

			onSuccess(file, res) {
				saveContent()
					.then(() => {
						isAutoSaving.value = false
						isManualSaving.value = true
						ElMessage.success('上传成功')
					})
					.finally(() => {
						isManualSaving.value = false
					})
			},

			onFailed(file, res) {},

			onError(file, err, res) {
				// JS 语法
				if (err.message.includes('timeout')) {
					ElMessage.error('上传超时，请重试')
				} else if (err.message.includes('size')) {
					ElMessage.error('大小不能超过512MB')
				} else if (err.message === 'Upload error') {
					ElMessage.error('上传失败，请重试')
				} else {
					ElMessage.error(err.message)
				}
			}
		}
	}
}

const isInit = ref(false)
const isLoading = ref(true)
const isDisabled = ref(true)
const isSaveSuccess = ref(true)
const isAutoSaving = ref(false)
// const isWaitingAutoSaving = ref(false)
const isManualSaving = ref(false)
const isShowOutline = ref(false)
const isShowFind = ref(false)
const activeOutline = ref(['1'])

// 编辑器回调函数
const handleCreated = (editor) => {
	editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = (editor) => {
	if (isInit.value === false) {
		return
	}

	tableOfContents.value = generateTableOfContents()

	if (store.deviceType === '移动设备') {
		const imageContainers = document.querySelectorAll('.w-e-image-container')

		imageContainers.forEach(function (container) {
			container.style.width = '100%'
		})
	}

	const videoContainers = document.querySelectorAll('.w-e-textarea-video-container')
	videoContainers.forEach(function (container) {
		container.style.display = 'inline-block'

		const videos = container.querySelectorAll('video')

		videos.forEach(function (video) {
			if (video.children[0].getAttribute('src').includes('audio')) {
				video.style.height = '50px'
				video.style.width = '300px'
			} else {
				if (store.deviceType === '移动设备') {
					video.style.maxHeight = '20rem'
				} else {
					video.style.maxHeight = '40rem'
				}
			}
		})
	})

	if (editor.getHtml() !== oldHtml.value) {
		const imgRegEx = /<img.*?>/gi
		const richText = valueHtml.value

		valueHtml.value = richText.replace(imgRegEx, (match) => {
			return match.replace(/style=""/, 'style="width:40%;"')
		})

		// valueHtml.value = valueHtml.value.replace(/<video/g, '<video controls style="width:100%;"')

		// console.log(editor.getElemsByType('video'))

		handleAutoSave()
		oldHtml.value = editor.getHtml()
	}
}
const handleBlur = (editor) => {
	saveContent()
}
const customAlert = (info, type) => {
	alert(`【自定义提示】${type} - ${info}`)
}

const disable = () => {
	const editor = editorRef.value
	if (editor == null) return
	editor.disable()
	isDisabled.value = true
}

const enable = () => {
	const editor = editorRef.value
	if (editor == null) return
	editor.enable()
	isDisabled.value = false
}

async function handleRefresh() {
	// resetPageData()
	// if (!isDisabled.value) {
	// 	handleManualSave().then(async () => {
	// 		await resetPageData()
	//
	// 		fetchCurrentNote().then(() => {
	// 			ElMessage.success('刷新成功')
	// 		})
	// 	})
	// } else {
	// 	await resetPageData()
	//
	// 	fetchCurrentNote().then(() => {
	// 		ElMessage.success('刷新成功')
	// 	})
	// }

	// saveContent().then(() => {
	router.go(0)
	// })
}

function handleOpenReadonly() {
	disable()
	handleManualSave().then(() => {
		fetchCurrentNote().then(() => {
			ElMessage('进入只读模式')
		})
	})
}

function handleOpenEdit() {
	enable()
	ElMessage('进入编辑模式')
}

async function handleManualSave() {
	isAutoSaving.value = false
	isManualSaving.value = true

	return saveContent()
		.then(() => {
			ElMessage.success('保存成功')
		})
		.catch(() => {
			ElMessage.error('保存失败')
		})
		.finally(() => {
			isManualSaving.value = false
		})
}

function handleShowOutline() {
	isShowOutline.value = !isShowOutline.value
	activeOutline.value = isShowOutline.value ? ['1'] : []
}

function handleCloseFind() {
	isShowFind.value = false
	query.keyword = ''
	query.isHighlighting = false
	query.isCaseSensitive = false
}

async function fetchCurrentNote() {
	return service
		.post('/api/note/get-content', { data: { id: currentNoteId.value } })
		.then((res) => {
			title.value = res.data.title
			modifiedTime.value = res.data.modifiedTime
			stared.value = res.data.stared
			valueHtml.value = res.data.content
			oldHtml.value = res.data.content

			store.currentNote.id = currentNoteId.value
			store.currentNote.title = res.data.title
			store.currentNote.modifiedTime = res.data.modifiedTime
			store.currentNote.stared = res.data.stared
			store.currentNote.folderInfo = res.data.folderInfo
		})
		.then(() => {
			isInit.value = true
			isLoading.value = false
		})
		.catch(() => {
			ElMessage.error('获取笔记内容失败')
			router.push('/latest')
		})

	// 模拟 ajax 异步获取内容
	// setTimeout(() => {
	// 	valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
	// 	isLoading.value = false
	// }, 2000)
}

const autoSaveTimer = ref(-1)

function handleAutoSave() {
	if (!isInit.value) {
		return
	}

	if (isManualSaving.value) return

	if (autoSaveTimer.value !== -1) {
		clearTimeout(autoSaveTimer.value)
	}

	autoSaveTimer.value = setTimeout(() => {
		isAutoSaving.value = true
		saveContent().finally(() => {
			isAutoSaving.value = false
		})
	}, 2000)
}

async function saveContent() {
	return service
		.post('/api/note/update/content', {
			data: {
				id: currentNoteId.value,
				htmlContent: editorRef.value.getHtml(),
				textContent: editorRef.value.getText()
			}
		})
		.then(() => {
			service.post('/api/note/get-content', { data: { id: currentNoteId.value } }).then((res) => {
				modifiedTime.value = res.data.modifiedTime
				store.currentNote.modifiedTime = res.data.modifiedTime
			})
		})
		.catch((err) => {
			isSaveSuccess.value = false
		})
}

// 生成目录
const generateTableOfContents = () => {
	const headings = document.querySelectorAll('h1, h2, h3')
	const toc = []
	headings.forEach((heading, index) => {
		const id = `section-${index + 1}`
		const level = heading.tagName === 'H1' ? 1 : heading.tagName === 'H2' ? 2 : 3 // 根据标题等级设置目录项的缩进
		heading.setAttribute('id', id) // 设置标题的id属性
		toc.push({ id: id, text: heading.textContent, level: level, index: index }) // 将标题文本、id和等级添加到目录项中
	})
	return toc
}

function resetPageData() {
	return new Promise((resolve) => {
		query.keyword = ''
		query.isCaseSensitive = false
		query.isHighlighting = false
		title.value = ''
		modifiedTime.value = ''
		stared.value = 0
		valueHtml.value = ''
		oldHtml.value = ''
		tableOfContents.value = []
		isInit.value = false
		isLoading.value = true
		isDisabled.value = true
		isSaveSuccess.value = true
		isAutoSaving.value = false
		isManualSaving.value = false
		isShowOutline.value = false
		isShowFind.value = false
		activeOutline.value = ['1']

		resetCurrentNote()

		resolve()
	})
}

function highlightContent() {
	const text = valueHtml.value

	if (query.isHighlighting) {
		if (query.isCaseSensitive) {
			const highlight = `<span id="highlight">${query.keyword}</span>`
			return text.replace(new RegExp(query.keyword, 'g'), highlight)
		} else {
			const highlight = `<span id="highlight">${query.keyword}</span>`
			return text.replace(new RegExp(query.keyword, 'gi'), highlight)
		}
	} else {
		return text
	}
}

const timer = ref(-1)

// 组件销毁时，也及时销毁编辑器，重要！
onBeforeUnmount(() => {
	clearTimeout(timer.value)

	const editor = editorRef.value
	if (editor == null) return

	editor.destroy()
})

onMounted(() => {
	if (timer.value !== -1) {
		clearTimeout(timer.value)
	}

	timer.value = setTimeout(() => {
		const node1 = document.querySelector(
			'#ed33 > div:nth-child(1) > div > div:nth-child(24) > div > div:nth-child(1) > button > span'
		)
		const node2 = document.querySelector(
			'#ed33 > div:nth-child(1) > div > div:nth-child(24) > div > div:nth-child(2) > button > span'
		)
		const node3 = document.querySelector(
			'#ed33 > div:nth-child(2) > div > div.w-e-modal > div > label:nth-child(1) > span'
		)

		node1.innerHTML = '插入媒体'
		node2.innerHTML = '上传媒体'
	}, 2000)

	fetchCurrentNote().then(() => {
		tableOfContents.value = generateTableOfContents()
	})
})

watch(route, async () => {
	// router.go(0)
	isInit.value = false

	// editorConfig.MENU_CONF.uploadImage.server = '/api/file/image/' + currentNoteId.value
	// editorConfig.MENU_CONF.uploadVideo.server = '/api/file/video/' + currentNoteId.value

	// disable()
	resetPageData().then(() => {
		fetchCurrentNote().then(() => {
			tableOfContents.value = generateTableOfContents()
		})
	})
})
</script>

<style>
.table-of-contents {
	li:hover {
		color: #2a9a5b;
	}
}

.el-collapse,
.el-collapse-item__wrap,
.el-collapse-item__header {
	border: none;
}
</style>
