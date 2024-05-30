<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { DataLine, Expand, Fold, Setting, User } from '@element-plus/icons-vue'
import { FolderOpen, Logout, Notes, Star, TagOne } from '@icon-park/vue-next'
import useStore, { resetCurrentNote, resetQuery, resetUserInfo } from '@/utils/store'
import service from '@/utils/request'
import { toLogin } from '@/utils/router'
import { ElInput, ElMessage, ElMessageBox } from 'element-plus'
import AsideSearchBar from '@/components/user/AsideSearchBar.vue'
import { useRoute, useRouter } from 'vue-router'
import NoteCard from '@/components/user/NoteCard.vue'
import defaultAvatar from '@/assets/default_avatar.png'
import FolderCard from '@/components/user/FolderCard.vue'
import AsideTitleBar from '@/components/user/AsideTitleBar.vue'
import TagCard from '@/components/user/TagCard.vue'

const PAGES = ['latest', 'folder', 'star', 'tag']

const store = useStore()
const route = useRoute()
const router = useRouter()

const isRefreshFetched = ref(false)

const isShowUserInfoPop = ref(false)
const isShowCreatePop = ref(false)

const avatarUrl = computed(() => {
	if (store.userInfo.avatar === '' || store.userInfo.avatar === null) {
		return defaultAvatar
	}

	return store.userInfo.avatar
})

const isAsideFolded = ref(false)
const page = computed(() => {
	return route.fullPath.split('/')[1]
})

const currentFolderId = computed(() => {
	if (page.value === 'folder') {
		if (route.fullPath.split('/')[2] === 'note' || !route.fullPath.split('/')[2]) {
			return 'root'
		}

		return route.fullPath.split('/')[2]
	}

	return 'root'
})
const currentNoteId = computed(() => {
	const page = route.fullPath.split('/')[1]

	if (page === 'latest') {
		return route.fullPath.split('/')[3] ?? null
	} else if (page === 'folder') {
		return route.fullPath.split('/')[2] === 'note'
			? route.fullPath.split('/')[3] ?? null
			: route.fullPath.split('/')[4] ?? null
	} else if (page === 'star') {
		return route.fullPath.split('/')[3] ?? null
	} else if (page === 'tag') {
		return route.fullPath.split('/')[4] ?? null
	}

	return null
})

const currentFolder = ref({
	id: '',
	name: '',
	parentId: ''
})

const currentTagId = computed(() => {
	if (page.value === 'tag') {
		return route.fullPath.split('/')[2] ?? null
	}

	return null
})

const currentTag = ref({
	id: '',
	name: ''
})

const asideWidth = computed(() => {
	if (isAsideFolded.value) {
		return '0'
	}

	if (!PAGES.includes(page.value)) {
		return '4rem'
	}

	return '20rem'
})

const query = store.asideInfo.query

const subAsideLoading = ref(true)
const isFetching = ref(false)

const activeId = ref('')

const noteList = ref([])
const folders = ref([])
const tags = ref([])

const locationTree = ref([])
const locationValue = ref('')
const locationTarget = ref(null)
const isShowLocationDialog = ref(false)

function handleLogout() {
	service.post('/api/auth/logout').then(() => {
		toLogin()
		ElMessage.success('退出登录成功')
		resetUserInfo()
	})
}

function handleCreatNote() {
	isShowCreatePop.value = false

	ElMessageBox.prompt('请输入笔记名称', '新建笔记', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputPattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
		inputErrorMessage: '笔记名不能包含特殊字符!'
	})
		.then(({ value }) => {
			const title = value.trim()

			service
				.post('/api/note/create', {
					data: {
						title: title,
						folderId: currentFolderId.value ? currentFolderId.value : null
					}
				})
				.then((res) => {
					router.push('/latest/note/' + res.data.id).then(() => {
						router.go(0)
					})

					// if (page.value === 'latest' || page.value === 'folder') {
					// 	if (query.isHighlighting) {
					// 		if (res.data.title.includes(query.keyword)) {
					// 			noteList.value.unshift(res.data)
					// 		}
					// 	} else {
					// 		noteList.value.unshift(res.data)
					// 	}
					// } else {
					// 	router.push('/latest')
					// }

					ElMessage.success('创建成功')
				})
				.catch((error) => {
					ElMessage.error(error.data.message)
				})
		})
		.catch(() => {})
}

function handleCreateFolder() {
	isShowCreatePop.value = false

	ElMessageBox.prompt('请输入文件夹名称', '新建文件夹', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputPattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
		inputErrorMessage: '文件夹名不能包含特殊字符!'
	})
		.then(({ value }) => {
			const name = value.trim()

			service
				.post('/api/folder/create', {
					data: {
						name: name,
						parentId: currentFolderId.value ? currentFolderId.value : null
					}
				})
				.then((res) => {
					if (page.value === 'folder') {
						if (query.isHighlighting) {
							if (res.data.name.includes(query.keyword)) {
								folders.value.unshift(res.data)
							}
						} else {
							folders.value.unshift(res.data)
						}
					} else {
						router.push('/folder')
					}

					ElMessage.success('创建成功')
				})
				.catch((error) => {
					ElMessage.error(error.data.message)
				})
		})
		.catch(() => {})
}

function fetchLatestNotes(mode = 'refresh') {
	fetchNotes(mode)
}

async function fetchFolders(mode = 'refresh') {
	if (isFetching.value) return

	isFetching.value = true

	setTimeout(() => {
		isFetching.value = false
	}, 1000)

	if (mode === 'refresh') {
		query.currentFolderPage = 1
	} else if (mode === 'more') {
		if (folders.value.length === 0 || query.currentFolderPage < 2) {
			return
		}
	}

	return service
		.post('/api/folder/list', {
			data: {
				page: query.currentFolderPage,
				size: query.pageSize,
				query: {
					keyword: query.keyword.trim(),
					parentId: query.searchScope === 1 ? currentFolderId.value : null
				}
			}
		})
		.then((res) => {
			const newFolders = res.data.list
			query.totalFoldersPage = res.data.totalPages

			if (mode === 'refresh') {
				query.currentFolderPage = 2
				folders.value = newFolders
			} else if (mode === 'more') {
				if (newFolders.length !== 0) {
					folders.value = folders.value.concat(newFolders)
					query.currentFolderPage = query.currentFolderPage + 1
				}
			}

			subAsideLoading.value = false

			return res
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
			subAsideLoading.value = false
		})
}

async function fetchNotes(mode = 'refresh') {
	if (isFetching.value) return

	isFetching.value = true

	setTimeout(() => {
		isFetching.value = false
	}, 1000)

	if (mode === 'refresh') {
		query.currentNotePage = 1
	} else if (mode === 'more') {
		if (noteList.value.length === 0 || query.currentNotePage < 2) {
			return
		}
	}

	// console.log(query.isCaseSensitive)
	let folderId = page.value === 'folder' ? currentFolderId.value : null
	if (query.searchScope === 0) {
		folderId = null
	}

	return service
		.post('/api/note/list', {
			data: {
				page: query.currentNotePage,
				size: query.pageSize,
				query: {
					keyword: query.keyword.trim(),
					folderId: folderId,
					tagId: currentTagId.value ?? null,
					stared: page.value === 'star' ? 1 : -1,
					isCaseSensitive: query.isCaseSensitive
				}
			}
		})
		.then((res) => {
			const newNotes = res.data.list
			query.totalNotesPage = res.data.totalPages

			if (mode === 'refresh') {
				query.currentNotePage = 2
				noteList.value = newNotes
			} else if (mode === 'more') {
				if (newNotes.length !== 0) {
					query.currentNotePage = query.currentNotePage + 1
					noteList.value = noteList.value.concat(newNotes)
				}
			}

			subAsideLoading.value = false
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
			subAsideLoading.value = false
		})
}

function fetchStaredNotes(mode = 'refresh') {
	fetchNotes(mode)
}

async function fetchTags(mode = 'refresh') {
	if (isFetching.value) return

	isFetching.value = true

	setTimeout(() => {
		isFetching.value = false
	}, 1000)

	if (mode === 'refresh') {
		query.currentTagPage = 1
	} else if (mode === 'more') {
		if (tags.value.length === 0 || query.currentTagPage < 2) {
			return
		}
	}

	return service
		.post('/api/tag/list', {
			data: {
				page: query.currentTagPage,
				size: query.pageSize,
				query: {
					keyword: query.keyword.trim(),
					isCaseSensitive: query.isCaseSensitive
				}
			}
		})
		.then((res) => {
			const newTags = res.data.list
			query.totalTagsPage = res.data.totalPages

			if (mode === 'refresh') {
				query.currentTagPage = 2
				tags.value = newTags
			} else if (mode === 'more') {
				if (newTags.length !== 0) {
					query.currentTagPage = query.currentTagPage + 1
					tags.value = tags.value.concat(newTags)
				}
			}

			subAsideLoading.value = false
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
			subAsideLoading.value = false
		})
}

function fetchNewData() {
	// console.log('yes')

	if (isFetching.value || !isRefreshFetched.value) return

	switch (page.value) {
		case 'latest':
			if (query.currentNotePage <= query.totalNotesPage) {
				fetchLatestNotes('more')
			}

			break
		case 'folder':
			if (
				query.currentFolderPage <= query.totalFoldersPage ||
				query.currentNotePage <= query.totalNotesPage
			) {
				fetchFolderPageData('more')
			}
			break
		case 'star':
			if (query.currentNotePage <= query.totalNotesPage) {
				fetchStaredNotes('more')
			}
			break
		case 'tag':
			if (currentTagId.value === null) {
				if (query.currentTagPage <= query.totalTagsPage) {
					fetchTagPageData('more')
				}
			} else {
				if (query.currentNotePage <= query.totalNotesPage) {
					fetchTagPageData('more')
				}
			}

			break
	}
}

onMounted(() => {
	if (currentNoteId.value !== null) {
		activeId.value = currentNoteId.value
	}

	switch (page.value) {
		case 'latest':
			fetchLatestNotes()
			break
		case 'folder':
			fetchFolderPageData()
			break
		case 'star':
			fetchStaredNotes()
			break
		case 'tag':
			fetchTagPageData()
			break
	}

	isRefreshFetched.value = true
})

function handleFolderCardClick(item) {
	activeId.value = item.id

	router.push(`/folder/${item.id}`)

	// store.asideInfo.activeNote.id = ''
}

function fetchCurrentFolder() {
	if (currentFolderId.value !== 'root') {
		service
			.post('/api/folder/get-one', {
				data: {
					id: currentFolderId.value
				}
			})
			.then((res) => {
				currentFolder.value = res.data
			})
			.catch((error) => {
				ElMessage.error(error.data.message)
			})
	} else {
		currentFolder.value = {
			id: '',
			name: '',
			parentId: ''
		}
	}
}

function fetchCurrentTag() {
	if (currentTagId.value) {
		service
			.post('/api/tag/get-one', {
				data: {
					id: currentTagId.value
				}
			})
			.then((res) => {
				currentTag.value = res.data
			})
			.catch((error) => {
				ElMessage.error(error.data.message)
			})
	} else {
		currentTag.value = {
			id: '',
			name: ''
		}
	}
}

function handleDeleteFolder(item) {
	ElMessageBox.confirm('是否删除该文件夹下的所有数据？', '删除文件夹', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			service
				.post('/api/folder/delete', {
					data: {
						id: item.id
					}
				})
				.then(() => {
					folders.value.splice(folders.value.indexOf(item), 1)

					ElMessage.success('删除成功')
				})
				.catch((error) => {
					ElMessage.error(error.data.message)
				})
		})
		.catch(() => {})
}

function handleRenameFolder(item) {
	ElMessageBox.prompt('请输入新的文件夹名称', '重命名文件夹', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputPattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
		inputErrorMessage: '文件夹名不能包含特殊字符!',
		inputValue: item.name
	})
		.then(({ value }) => {
			const name = value.trim()

			if (name === item.name) {
				ElMessage.warning('文件夹名未改变')
				return
			}

			service
				.post('/api/folder/update', {
					data: {
						id: item.id,
						name: name,
						parentId: item.parentId
					}
				})
				.then((res) => {
					const index = folders.value.findIndex((folder) => folder.id === item.id)

					if (query.isHighlighting) {
						if (!res.data.title.includes(query.keyword)) {
							folders.value.splice(index, 1)

							ElMessage.success('重命名成功')
							return
						}
					}

					const folder = folders.value[index]
					folder.name = name
					folder.updatedAt = res.data.updatedAt

					folders.value.splice(index, 1)
					folders.value.unshift(folder)

					ElMessage.success('重命名成功')
				})
				.catch((error) => {
					ElMessage.error(error.data.message)
				})
		})
		.catch(() => {})
}

function handleMoveFolder(item) {
	service
		.post('/api/folder/get-tree', {
			data: {
				id: item.id
			}
		})
		.then((res) => {
			locationTree.value = [res.data]
			locationValue.value = item.parentId ?? 'root'
			locationTarget.value = item

			if (locationTree.value.length === 0) {
				return
			}

			isShowLocationDialog.value = true
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
}

function handlePerformFolderMove() {
	const oldParentId =
		locationTarget.value.parentId === null ? 'root' : locationTarget.value.parentId
	const newParentId = locationValue.value

	if (oldParentId === newParentId) {
		ElMessage.warning('目标位置未改变')
		return
	}

	service
		.post('/api/folder/update', {
			data: {
				id: locationTarget.value.id,
				name: locationTarget.value.name,
				parentId: locationValue.value
			}
		})
		.then((res) => {
			ElMessage.success('移动成功')

			const targetFolderIndex = folders.value.findIndex(
				(folder) => folder.id === locationTarget.value.id
			)

			if (targetFolderIndex !== -1) {
				folders.value.splice(targetFolderIndex, 1)
			}
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
		.finally(() => {
			isShowLocationDialog.value = false
		})
}

function handleNoteCardClick(item) {
	activeId.value = item.id
	// store.asideInfo.activeNote.id = item.id

	const _page = route.fullPath.split('/')[1]

	switch (_page) {
		case 'latest':
			router.push(`/latest/note/${item.id}`)
			break
		case 'folder':
			if (currentFolderId.value === 'root') {
				router.push(`/folder/note/${item.id}`)
			} else {
				router.push(`/folder/${currentFolderId.value}/note/${item.id}`)
			}
			break
		case 'star':
			router.push(`/star/note/${item.id}`)
			break
		case 'tag':
			router.push(`/tag/${currentTagId.value}/note/${item.id}`)
			break
	}

	if (store.deviceType === '移动设备') {
		isAsideFolded.value = true
	}
}

function handleRenameNote(item) {
	ElMessageBox.prompt('请输入新的笔记名称', '重命名笔记', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputPattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
		inputErrorMessage: '笔记名不能包含特殊字符!',
		inputValue: item.title
	}).then(({ value }) => {
		const title = value.trim()

		if (title === item.title) {
			ElMessage.warning('笔记名未改变')
			return
		}

		service
			.post('/api/note/update/rename', {
				data: {
					id: item.id,
					title: title
				}
			})
			.then((res) => {
				const index = noteList.value.findIndex((note) => note.id === item.id)

				if (query.isHighlighting) {
					if (!res.data.title.includes(query.keyword)) {
						noteList.value.splice(index, 1)

						ElMessage.success('重命名成功')
						return
					}
				}

				const note = noteList.value[index]
				note.title = title
				note.modifiedTime = res.data.modifiedTime

				noteList.value.splice(index, 1)
				noteList.value.unshift(note)

				if (activeId.value === item.id) {
					store.currentNote.title = title
					store.currentNote.modifiedTime = res.data.modifiedTime
				}

				ElMessage.success('重命名成功')
			})
			.catch((error) => {
				ElMessage.error(error.data.message)
			})
	})
}

function handleDeleteNote(item) {
	ElMessageBox.confirm('是否删除该笔记？', '删除笔记', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			service
				.post('/api/note/delete', {
					data: {
						id: item.id
					}
				})
				.then(() => {
					noteList.value.splice(
						noteList.value.findIndex((note) => note.id === item.id),
						1
					)
					ElMessage.success('删除成功')

					if (activeId.value === item.id) {
						activeId.value = ''

						const fullPath = route.fullPath.split('/')

						if (fullPath[1] === 'latest' || fullPath[1] === 'star') {
							router.push(`/${fullPath[1]}`)
						} else if (fullPath[1] === 'folder') {
							router.push(
								`/folder${currentFolderId.value === 'root' ? '' : `/${currentFolderId.value}`}`
							)
						} else if (fullPath[1] === 'tag') {
							router.push(`/tag${currentTagId.value === null ? '' : `/${currentTagId.value}`}`)
						}
					}
				})
				.catch((error) => {
					ElMessage.error(error.data.message)
				})
		})
		.catch(() => {})
}

function handleMoveNote(item) {
	service
		.get('/api/note/get-tree')
		.then((res) => {
			locationTree.value = [res.data]
			locationValue.value = item.folderInfo.folderId ?? 'root'
			locationTarget.value = item

			if (locationTree.value.length === 0) {
				return
			}

			isShowLocationDialog.value = true
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
}

function handlePerformNoteMove() {
	const oldFolderId =
		locationTarget.value.folderInfo.folderId === null
			? 'root'
			: locationTarget.value.folderInfo.folderId
	const newFolderId = locationValue.value

	if (oldFolderId === newFolderId) {
		ElMessage.warning('目标位置未改变')
		return
	}

	service
		.post('/api/note/update/move', {
			data: {
				id: locationTarget.value.id,
				folderId: locationValue.value
			}
		})
		.then((res) => {
			ElMessage.success('移动成功')

			if (page.value === 'folder') {
				if (currentNoteId.value === locationTarget.value.id) {
					router.push(
						`/folder${currentFolderId.value === 'root' ? '' : `/${currentFolderId.value}`}`
					)
				}

				const noteIndex = noteList.value.findIndex((note) => note.id === locationTarget.value.id)

				if (noteIndex !== -1) {
					noteList.value.splice(noteIndex, 1)
				}

				const folderIndex = folders.value.findIndex((folder) => folder.id === newFolderId)

				service
					.post('/api/folder/get-one', {
						data: {
							id: res.data.folderId
						}
					})
					.then((res) => {
						const folder = folders.value[folderIndex]
						folder.updatedAt = res.data.updatedAt

						// 将更新后的项目移动到列表首位
						folders.value.splice(folderIndex, 1)
						folders.value.unshift(folder)
					})
			} else {
				const index = noteList.value.findIndex((note) => note.id === locationTarget.value.id)

				const note = noteList.value[index]
				note.modifiedTime = res.data.modifiedTime
				note.folderInfo = res.data.folderInfo

				noteList.value.splice(index, 1)
				noteList.value.unshift(note)

				if (activeId.value === locationTarget.value.id) {
					store.currentNote.modifiedTime = res.data.modifiedTime
				}
			}
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
		.finally(() => {
			isShowLocationDialog.value = false
		})
}

function getHandlePerformMove() {
	if (locationTarget.value.name) {
		handlePerformFolderMove()
	} else {
		handlePerformNoteMove()
	}
}

async function handleStarNote(item) {
	return service
		.post('/api/note/update/star', {
			data: {
				id: item.id
			}
		})
		.then((res) => {
			// 显示成功的消息
			ElMessage.success(item.stared === 1 ? '收藏成功' : '取消收藏成功')

			if (page.value === 'star') {
				noteList.value.splice(noteList.value.indexOf(item), 1)
				if (currentNoteId.value === item.id) {
					router.push('/star')
				}
			}

			// 找到项目索引
			const index = noteList.value.findIndex((note) => note.id === item.id)

			// 更新列表中的项目信息
			const note = noteList.value[index]
			note.stared = item.stared === 1 ? 0 : 1 // 更新收藏状态
			note.modifiedTime = res.data.modifiedTime // 更新修改时间

			// 将更新后的项目移动到列表首位
			noteList.value.splice(index, 1) // 删除原位置的项目
			noteList.value.unshift(note) // 添加到数组首位

			// 如果是当前活跃的项目，也更新存储的信息
			if (activeId.value === item.id) {
				store.currentNote.stared = note.stared
				store.currentNote.modifiedTime = note.modifiedTime
			}
		})

		.catch((error) => {
			ElMessage.error(error.data.message)
		})
}

function fetchFolderPageData(mode = 'refresh') {
	fetchFolders(mode).then((res) => {
		if (res !== undefined) {
			if (res.data.currentPage >= res.data.totalPages) {
				isFetching.value = false
				fetchNotes(mode)
			}
		}
	})

	if (mode === 'refresh') {
		fetchCurrentFolder()
	}
}

function fetchTagPageData(mode = 'refresh') {
	if (currentTagId.value === null) {
		fetchTags(mode)
		currentTag.value = {
			id: '',
			name: ''
		}

		return
	}

	fetchNotes(mode)

	if (mode === 'refresh') {
		fetchCurrentTag()
	}
}

function handleDeleteTag(item) {
	ElMessageBox.confirm('是否删除该标签？（该操作不会删除笔记）', '删除标签', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	})
		.then(() => {
			service
				.post('/api/tag/delete', {
					data: {
						id: item.id
					}
				})
				.then(() => {
					tags.value.splice(tags.value.indexOf(item), 1)
					ElMessage.success('删除成功')
				})
				.catch((error) => {
					ElMessage.error(error.data.message)
				})
		})
		.catch(() => {})
}

function handleRenameTag(item) {
	ElMessageBox.prompt('请输入新的标签名称', '重命名标签', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		inputPattern: /^[a-zA-Z0-9\u4e00-\u9fa5]+$/,
		inputErrorMessage: '标签名不能包含特殊字符!',
		inputValue: item.name
	})
		.then(({ value }) => {
			const title = value.trim()

			if (title === item.name) {
				ElMessage.warning('标签名未改变')
				return
			}

			service
				.post('/api/tag/rename', {
					data: {
						id: item.id,
						name: title
					}
				})
				.then(() => {
					ElMessage.success('重命名成功')
					tags.value = tags.value.map((tag) => {
						if (tag.id === item.id) {
							tag.name = title
						}

						return title
					})
				})
				.catch((error) => {
					ElMessage.error(error.data.message)
				})
		})
		.catch(() => {})
}

function handleBackClick() {
	if (page.value === 'folder') {
		if (currentFolder.value.parentId === null) {
			router.push(`/folder`)
			return
		}

		router.push(`/folder/${currentFolder.value.parentId}`)
	} else if (page.value === 'tag') {
		router.push(`/tag`)
	}
}

function handleSearch() {
	query.isHighlighting = true

	switch (page.value) {
		case 'latest':
			noteList.value = []
			fetchLatestNotes()
			break
		case 'folder':
			folders.value = []
			noteList.value = []
			fetchFolderPageData()
			break
		case 'star':
			noteList.value = []
			fetchStaredNotes()
			break
		case 'tag':
			tags.value = []
			fetchTagPageData()
			break
	}
}

function handleSearchReset() {
	resetPageData().then(() => {
		isFetching.value = false

		switch (page.value) {
			case 'latest':
				fetchLatestNotes()
				break
			case 'folder':
				fetchFolderPageData()
				break
			case 'star':
				fetchStaredNotes()
				break
			case 'tag':
				fetchTagPageData()
				break
		}

		isRefreshFetched.value = true
	})
}

async function handleRenameEditorNote() {
	const item = noteList.value.find((note) => note.id === activeId.value)
	handleRenameNote(item)
}

const isShowMoreInfoDialog = ref(false)
const moreInfo = ref({
	id: '',
	title: '',
	modifiedTime: '',
	wordCount: 0,
	fileCount: {
		imageCount: 0,
		videoCount: 0,
		audioCount: 0
	}
})
const moreInfoDialogInputValue = ref('')
const moreInfoTags = ref([])
const moreInfoDialogInputVisible = ref(false)
const moreInfoInputRef = ref()

const handleMoreInfoDeleteTag = (tag) => {
	service
		.post('/api/note/delete-tag', {
			data: {
				noteId: moreInfo.value.id,
				tagId: tag.id
			}
		})
		.then((res) => {
			moreInfoTags.value.splice(moreInfoTags.value.indexOf(tag), 1)
			ElMessage.success('删除标签成功！')

			if (route.fullPath.split('/')[1] === 'tag' && route.fullPath.split('/')[2]) {
				const note = noteList.value.find((note) => note.id === moreInfo.value.id)

				if (tag.id === currentTagId.value) {
					noteList.value.splice(noteList.value.indexOf(note), 1)
					isShowMoreInfoDialog.value = false
				} else {
					const index = noteList.value.findIndex((note) => note.id === moreInfo.value.id)
					const note = noteList.value[index]
					note.modifiedTime = res.data.modifiedTime

					noteList.value.splice(index, 1)
					noteList.value.unshift(note)

					if (activeId.value === moreInfo.value.id) {
						store.currentNote.modifiedTime = res.data.modifiedTime
					}
				}

				if (noteList.value.length === 0) {
					router.push('/tag')
				}
			}
		})
		.catch((error) => {
			ElMessage.error(error.data.message)
		})
}

const showMoreInfoDialogInput = () => {
	moreInfoDialogInputVisible.value = true
	nextTick(() => {
		moreInfoInputRef.value?.input?.focus()
	})
}

const handleMoreInfoDialogInputConfirm = () => {
	const inputVal = moreInfoDialogInputValue.value.trim()

	if (moreInfoDialogInputValue.value) {
		service
			.post('/api/note/add-tag', {
				data: {
					noteId: moreInfo.value.id,
					tagName: inputVal
				}
			})
			.then((res) => {
				moreInfoTags.value.push({
					id: res.data,
					name: inputVal
				})

				const index = noteList.value.findIndex((note) => note.id === moreInfo.value.id)

				service
					.post('/api/note/get-more-info', {
						data: {
							id: moreInfo.value.id
						}
					})
					.then((res) => {
						const note = noteList.value[index]
						note.modifiedTime = res.data.modifiedTime

						noteList.value.splice(index, 1)
						noteList.value.unshift(note)

						if (activeId.value === moreInfo.value.id) {
							store.currentNote.modifiedTime = res.data.modifiedTime
						}

						ElMessage.success('添加标签成功！')
					})
			})
			.catch((error) => {
				ElMessage.error(error.data.message)
			})
	}

	moreInfoDialogInputValue.value = ''
	moreInfoDialogInputVisible.value = false
}

function handleMoreInfo(noteId) {
	isShowMoreInfoDialog.value = true

	service
		.post('/api/note/get-more-info', {
			data: {
				id: noteId
			}
		})
		.then((res) => {
			moreInfo.value = res.data
			moreInfoTags.value = res.data.tags
		})
}

function resetPageData() {
	return new Promise((resolve) => {
		noteList.value = []
		folders.value = []
		tags.value = []
		isRefreshFetched.value = false
		isFetching.value = true
		resetQuery()
		resetCurrentNote()

		currentFolder.value = {
			id: '',
			name: '',
			parentId: ''
		}
		currentTag.value = {
			id: '',
			name: ''
		}

		subAsideLoading.value = true
		isShowUserInfoPop.value = false
		isShowCreatePop.value = false
		locationTree.value = []
		locationValue.value = ''
		locationTarget.value = null
		isShowLocationDialog.value = false
		isShowMoreInfoDialog.value = false
		moreInfo.value = {
			id: '',
			title: '',
			modifiedTime: '',
			wordCount: 0,
			fileCount: {
				imageCount: 0,
				videoCount: 0,
				audioCount: 0
			}
		}
		moreInfoDialogInputValue.value = ''
		moreInfoTags.value = []
		moreInfoDialogInputVisible.value = false
		moreInfoInputRef.value = null

		resolve()
	})
}

watch(route, (newValue, oldValue) => {
	// store.asideInfo.activeNote.id = ''

	if (currentNoteId.value !== null) {
		activeId.value = currentNoteId.value
	}

	if (currentNoteId.value === null) {
		resetPageData()
			.then(() => {
				activeId.value = ''
				isFetching.value = false

				const newPage = newValue.fullPath.split('/')[1]

				switch (newPage) {
					case 'latest':
						fetchLatestNotes()
						break
					case 'folder':
						fetchFolderPageData()
						break
					case 'star':
						fetchStaredNotes()
						break
					case 'tag':
						fetchTagPageData()
						break
				}
			})
			.then(() => {
				isRefreshFetched.value = true
			})
	}
})
</script>

<template>
	<el-dialog
		v-model="isShowMoreInfoDialog"
		:title="moreInfo.title"
		destroy-on-close
		@closed="
			() => {
				moreInfo = {
					title: '',
					modifiedTime: '',
					wordCount: 0,
					fileCount: {
						imageCount: 0,
						videoCount: 0,
						audioCount: 0
					}
				}
			}
		"
		:width="store.deviceType === '移动设备' ? '90%' : '25%'"
	>
		<div class="flex flex-col gap-1 mb-4">
			<p>更新于：{{ moreInfo.modifiedTime }}</p>
			<p>字数：{{ moreInfo.wordCount }}</p>
			<p>图片数：{{ moreInfo.fileCount.imageCount }}</p>
			<p>视频数：{{ moreInfo.fileCount.videoCount }}</p>
			<p>音频数：{{ moreInfo.fileCount.audioCount }}</p>
		</div>
		<div class="flex gap-2 flex-wrap justify-start items-center">
			<el-tag
				v-for="tag in moreInfoTags"
				:key="tag.id"
				closable
				:disable-transitions="false"
				@close="handleMoreInfoDeleteTag(tag)"
				effect="plain"
				type="success"
			>
				{{ tag.name }}
			</el-tag>
			<el-input
				v-if="moreInfoDialogInputVisible"
				ref="moreInfoInputRef"
				v-model="moreInfoDialogInputValue"
				class="max-w-28"
				size="small"
				maxlength="16"
				@keyup.enter="handleMoreInfoDialogInputConfirm"
				@blur="handleMoreInfoDialogInputConfirm"
			/>
			<el-button v-else class="button-new-tag" size="small" @click="showMoreInfoDialogInput">
				+ 新标签
			</el-button>
		</div>
	</el-dialog>

	<el-dialog
		v-model="isShowLocationDialog"
		title="移动到"
		destroy-on-close
		@closed="
			() => {
				locationTree = []
				locationValue = ''
				locationTarget = null
			}
		"
		:width="store.deviceType === '移动设备' ? '90%' : '25%'"
	>
		<div>
			<div class="mb-2">请选择目标位置</div>
			<el-tree-select v-model="locationValue" :data="locationTree" check-strictly show-checkbox />
		</div>
		<template #footer>
			<div class="dialog-footer mt-4">
				<el-button @click="isShowLocationDialog = false">取消</el-button>
				<el-button type="primary" @click="getHandlePerformMove"> 确定</el-button>
			</div>
		</template>
	</el-dialog>
	<el-container class="h-screen bg-white">
		<el-aside
			class="bg-[#f9fafbff] overflow-hidden"
			:style="{
				width: asideWidth,
				height: '100vh', // 设置高度与视口一致
				overflow: 'hidden' // 禁止滚动
			}"
		>
			<div class="h-full flex flex-row">
				<div class="w-[4rem] h-full border-r pt-6">
					<div class="h-full flex flex-col items-center justify-between">
						<div class="flex flex-col items-center gap-1">
							<el-popover
								placement="right-end"
								:width="'16rem'"
								trigger="hover"
								:visible="isShowUserInfoPop"
							>
								<template #reference>
									<div
										:class="
											isShowUserInfoPop
												? 'w-full aspect-square flex items-center justify-center bg-gray-200 cursor-pointer rounded-lg'
												: 'w-full aspect-square flex items-center justify-center hover:bg-gray-200 cursor-pointer rounded-lg'
										"
										@click="isShowUserInfoPop = !isShowUserInfoPop"
									>
										<el-image
											class="w-9/12 aspect-square rounded-full my-2"
											fit="cover"
											:src="avatarUrl"
										/>
									</div>
								</template>
								<div class="flex flex-col gap-1" @mouseleave="isShowUserInfoPop = false">
									<div class="flex flex-row items-center justify-between mb-4">
										<el-image
											class="w-3/12 aspect-square rounded-full"
											fit="cover"
											:src="avatarUrl"
										/>
										<el-tooltip placement="right" :content="store.userInfo.name">
											<span
												class="font-bold text-lg w-8/12 text-right whitespace-nowrap overflow-hidden text-ellipsis"
												>{{ store.userInfo.name }}</span
											>
										</el-tooltip>
									</div>
									<div class="w-full h-[1px] bg-gray-200 my-2"></div>
									<router-link to="/userinfo">
										<div
											:class="
												page === 'userinfo'
													? 'text-[#2a9a5b] w-full bg-gray-100 text-sm font-bold flex flex-row items-center cursor-pointer p-2 rounded'
													: 'text-gray-400 w-full hover:bg-gray-100 text-sm font-bold flex flex-row items-center cursor-pointer p-2 rounded'
											"
											@click="isShowUserInfoPop = false"
										>
											<el-icon class="mr-2" size="20">
												<User />
											</el-icon>
											个人中心
										</div>
									</router-link>
									<router-link to="/statistics">
										<div
											:class="
												page === 'statistics'
													? 'text-[#2a9a5b] w-full bg-gray-100 text-sm font-bold flex flex-row items-center cursor-pointer p-2 rounded'
													: 'text-gray-400 w-full hover:bg-gray-100 text-sm font-bold flex flex-row items-center cursor-pointer p-2 rounded'
											"
											@click="isShowUserInfoPop = false"
										>
											<el-icon class="mr-2" size="20">
												<DataLine />
											</el-icon>
											数据统计
										</div>
									</router-link>
									<div class="w-full h-[1px] bg-gray-200 my-2"></div>
									<div
										class="text-gray-400 w-full hover:bg-gray-100 text-sm font-bold flex flex-row items-center cursor-pointer p-2 rounded"
										@click="handleLogout"
									>
										<logout
											theme="outline"
											size="20"
											fill="#9b9b9b"
											:strokeWidth="3"
											class="mr-2"
										/>
										退出登录
									</div>
								</div>
							</el-popover>

							<!--    <div class="bg-[#2a9a5b] mt-8 cursor-pointer w-9 aspect-square rounded flex items-center justify-center text-white text-2xl">-->
							<!--     +-->
							<!--    </div>-->
							<el-popover placement="bottom" trigger="click" :visible="isShowCreatePop">
								<template #reference>
									<el-button color="#2a9a5b" @click="isShowCreatePop = !isShowCreatePop"
										><span class="text-xl">+</span></el-button
									>
								</template>
								<div
									class="flex flex-row items-center justify-around"
									@mouseleave="isShowCreatePop = false"
								>
									<div
										class="flex flex-col items-center justify-center hover:bg-gray-200 w-14 aspect-square cursor-pointer rounded-md"
										@click="handleCreatNote"
									>
										<notes theme="outline" size="22" fill="#2a9a5b" class="mx-2" />
										<div class="mt-1">笔记</div>
									</div>
									<div
										class="flex flex-col items-center justify-center hover:bg-gray-200 w-14 aspect-square cursor-pointer rounded-md"
										@click="handleCreateFolder"
									>
										<FolderOpen theme="outline" size="22" fill="#feb156ff" class="mx-2" />
										<div class="mt-1">文件夹</div>
									</div>
								</div>
							</el-popover>

							<el-tooltip placement="right" content="最新笔记">
								<div
									:class="
										page === 'latest'
											? 'w-8/12 aspect-square flex items-center justify-center bg-gray-200 cursor-pointer rounded-lg mt-3'
											: 'w-8/12 aspect-square flex items-center justify-center hover:bg-gray-200 cursor-pointer rounded-lg mt-3'
									"
									@click="router.push('/latest')"
								>
									<notes
										theme="outline"
										size="20"
										:fill="page === 'latest' ? '#2a9a5b' : '#9b9b9b'"
										:strokeWidth="3"
									/>
								</div>
							</el-tooltip>
							<el-tooltip placement="right" content="我的文件夹">
								<div
									:class="
										page === 'folder'
											? 'w-8/12 aspect-square flex items-center justify-center bg-gray-200 cursor-pointer rounded-lg'
											: 'w-8/12 aspect-square flex items-center justify-center hover:bg-gray-200 cursor-pointer rounded-lg'
									"
									@click="router.push('/folder')"
								>
									<folder-open
										theme="outline"
										size="20"
										:fill="page === 'folder' ? '#2a9a5b' : '#9b9b9b'"
										:strokeWidth="3"
									/>
								</div>
							</el-tooltip>
							<el-tooltip placement="right" content="收藏">
								<div
									:class="
										page === 'star'
											? 'w-8/12 aspect-square flex items-center justify-center bg-gray-200 cursor-pointer rounded-lg'
											: 'w-8/12 aspect-square flex items-center justify-center hover:bg-gray-200 cursor-pointer rounded-lg'
									"
									@click="router.push('/star')"
								>
									<star
										theme="outline"
										size="20"
										:fill="page === 'star' ? '#2a9a5b' : '#9b9b9b'"
										:strokeWidth="3"
									/>
								</div>
							</el-tooltip>
							<el-tooltip placement="right" content="标签">
								<div
									:class="
										page === 'tag'
											? 'w-8/12 aspect-square flex items-center justify-center bg-gray-200 cursor-pointer rounded-lg'
											: 'w-8/12 aspect-square flex items-center justify-center hover:bg-gray-200 cursor-pointer rounded-lg'
									"
									@click="router.push('/tag')"
								>
									<tag-one
										theme="outline"
										size="20"
										:fill="page === 'tag' ? '#2a9a5b' : '#9b9b9b'"
										:strokeWidth="3"
									/>
								</div>
							</el-tooltip>
							<div class="w-8/12" v-if="store.deviceType === '移动设备'">
								<el-divider />
							</div>
							<el-tooltip placement="right" content="设置" v-if="store.deviceType === '移动设备'">
								<div
									class="w-8/12 aspect-square flex items-center justify-center hover:bg-gray-200 cursor-pointer rounded-lg"
									@click="router.push('/settings')"
								>
									<el-icon
										:color="page === 'settings' ? '#2a9a5b' : '#9b9b9b'"
										size="20"
										class="cursor-pointer"
									>
										<Setting />
									</el-icon>
								</div>
							</el-tooltip>

							<el-tooltip
								placement="right"
								content="折叠"
								v-if="store.deviceType === '移动设备'"
								:disabled="isAsideFolded"
							>
								<div
									class="w-8/12 aspect-square flex items-center justify-center hover:bg-gray-200 cursor-pointer rounded-lg"
								>
									<el-icon
										color="#b3b3b3"
										size="20"
										class="cursor-pointer"
										@click="isAsideFolded = true"
									>
										<Fold />
									</el-icon>
								</div>
							</el-tooltip>
						</div>
						<div
							class="w-full flex flex-col items-center pb-4"
							v-if="store.deviceType === '桌面设备'"
						>
							<el-tooltip placement="right" content="设置">
								<div
									class="w-8/12 aspect-square flex items-center justify-center hover:bg-gray-200 cursor-pointer rounded-lg"
									@click="router.push('/settings')"
								>
									<el-icon
										:color="page === 'settings' ? '#2a9a5b' : '#9b9b9b'"
										size="20"
										class="cursor-pointer"
									>
										<Setting />
									</el-icon>
								</div>
							</el-tooltip>
							<div class="w-8/12">
								<el-divider />
							</div>
							<el-tooltip placement="right" content="折叠">
								<div
									class="w-8/12 aspect-square flex items-center justify-center hover:bg-gray-200 cursor-pointer rounded-lg"
								>
									<el-icon
										color="#b3b3b3"
										size="20"
										class="cursor-pointer"
										@click="isAsideFolded = true"
									>
										<Fold />
									</el-icon>
								</div>
							</el-tooltip>
						</div>
					</div>
				</div>
				<div class="w-[12rem] grow h-full border-r pt-6 bg-white" v-if="asideWidth === '20rem'">
					<AsideSearchBar
						class="px-3"
						:disabled="subAsideLoading"
						:current-folder="currentFolder"
						:handle-search="handleSearch"
						:handle-reset="handleSearchReset"
					/>
					<AsideTitleBar
						class="my-4 px-3"
						title="最新笔记"
						:show-back="false"
						v-if="page === 'latest'"
					/>
					<AsideTitleBar class="my-4 px-3" title="收藏" :show-back="false" v-if="page === 'star'" />

					<AsideTitleBar
						class="my-4 px-3"
						:title="currentFolder.name === '' ? '我的文件夹' : currentFolder.name"
						:show-back="currentFolderId !== 'root'"
						v-if="page === 'folder'"
						:handle-back-click="handleBackClick"
					/>
					<AsideTitleBar
						class="my-4 px-3"
						:title="currentTag.name === '' ? '我的标签' : currentTag.name"
						:show-back="currentTagId !== null"
						v-if="page === 'tag'"
						:handle-back-click="handleBackClick"
					/>
					<el-scrollbar v-loading="subAsideLoading">
						<div
							class="h-full flex flex-col gap-0.5 px-3 pb-20"
							v-infinite-scroll="fetchNewData"
							infinite-scroll-distance="400"
							v-if="page === 'latest'"
						>
							<NoteCard
								:active="item && activeId === item.id"
								v-for="(item, index) in noteList"
								:key="index"
								@click="() => handleNoteCardClick(item)"
								:handle-delete-note="() => handleDeleteNote(item)"
								:handle-rename-note="() => handleRenameNote(item)"
								:handle-move-note="() => handleMoveNote(item)"
								:handle-star-note="() => handleStarNote(item)"
								:handle-more-info="() => handleMoreInfo(item.id)"
								:note="item"
							/>
							<el-empty description="暂无数据" v-if="noteList.length === 0 && !subAsideLoading" />
						</div>
						<div
							class="h-full flex flex-col gap-0.5 px-3 pb-20"
							v-infinite-scroll="fetchNewData"
							infinite-scroll-distance="400"
							v-if="page === 'star'"
						>
							<NoteCard
								:active="item && activeId === item.id"
								v-for="(item, index) in noteList"
								:key="index"
								@click="() => handleNoteCardClick(item)"
								:handle-delete-note="() => handleDeleteNote(item)"
								:handle-rename-note="() => handleRenameNote(item)"
								:handle-move-note="() => handleMoveNote(item)"
								:handle-star-note="() => handleStarNote(item)"
								:handle-more-info="() => handleMoreInfo(item.id)"
								:note="item"
							/>
							<el-empty description="暂无数据" v-if="noteList.length === 0 && !subAsideLoading" />
						</div>
						<div
							class="h-full flex flex-col gap-0.5 px-3 pb-20"
							v-infinite-scroll="fetchNewData"
							infinite-scroll-distance="400"
							v-if="page === 'folder'"
						>
							<FolderCard
								:active="activeId === item.id"
								v-for="(item, index) in folders"
								:key="index"
								@click="() => handleFolderCardClick(item)"
								:handle-delete-folder="() => handleDeleteFolder(item)"
								:handle-rename-folder="() => handleRenameFolder(item)"
								:handle-move-folder="() => handleMoveFolder(item)"
								:folder="item"
							/>
							<NoteCard
								:active="item && activeId === item.id"
								v-for="(item, index) in noteList"
								:key="index"
								@click="() => handleNoteCardClick(item)"
								:handle-delete-note="() => handleDeleteNote(item)"
								:handle-rename-note="() => handleRenameNote(item)"
								:handle-move-note="() => handleMoveNote(item)"
								:handle-star-note="() => handleStarNote(item)"
								:handle-more-info="() => handleMoreInfo(item.id)"
								:note="item"
							/>
							<el-empty
								description="暂无数据"
								v-if="folders.length === 0 && noteList.length === 0 && !subAsideLoading"
							/>
						</div>
						<div
							class="h-full flex flex-col gap-0.5 px-3 pb-20"
							v-infinite-scroll="fetchNewData"
							infinite-scroll-distance="400"
							v-if="page === 'tag' && currentTagId === null"
						>
							<TagCard
								:active="activeId === item.id"
								v-for="(item, index) in tags"
								:key="index"
								@click="
									() => {
										activeId = item.id
										router.push(`/tag/${item.id}`)
									}
								"
								:tag="item"
								:handle-delete-tag="() => handleDeleteTag(item)"
								:handle-rename-tag="() => handleRenameTag(item)"
							/>
							<el-empty description="暂无数据" v-if="tags.length === 0 && !subAsideLoading" />
						</div>
						<div
							class="h-full flex flex-col gap-0.5 px-3 pb-20"
							v-infinite-scroll="fetchNewData"
							infinite-scroll-distance="400"
							v-if="page === 'tag' && currentTagId !== null"
						>
							<NoteCard
								:active="item && activeId === item.id"
								v-for="(item, index) in noteList"
								:key="index"
								@click="() => handleNoteCardClick(item)"
								:handle-delete-note="() => handleDeleteNote(item)"
								:handle-rename-note="() => handleRenameNote(item)"
								:handle-move-note="() => handleMoveNote(item)"
								:handle-star-note="() => handleStarNote(item)"
								:handle-more-info="() => handleMoreInfo(item.id)"
								:note="item"
							/>
							<el-empty description="暂无数据" v-if="noteList.length === 0 && !subAsideLoading" />
						</div>
					</el-scrollbar>
				</div>
			</div>
		</el-aside>
		<el-main style="padding: 1rem" class="relative max-h-screen max-w-screen">
			<el-tooltip placement="right" content="展开" :disabled="!isAsideFolded">
				<div
					class="absolute left-0 bottom-[1.125rem] bg-gray-200 hover:bg-gray-300 cursor-pointer pt-2 pb-1 px-1 rounded-r-md z-20"
					v-if="isAsideFolded && store.deviceType === '桌面设备'"
					@click="isAsideFolded = false"
				>
					<el-icon color="#b3b3b3" size="20">
						<Expand />
					</el-icon>
				</div>
				<div
					class="absolute left-0 top-[26.5rem] bg-gray-200 hover:bg-gray-300 cursor-pointer pt-2 pb-1 px-1 rounded-r-md z-20"
					v-if="isAsideFolded && store.deviceType === '移动设备'"
					@click="isAsideFolded = false"
				>
					<el-icon color="#b3b3b3" size="20">
						<Expand />
					</el-icon>
				</div>
			</el-tooltip>
			<!--				<router-view v-if="store.asideInfo.activeNote.id === ''" />-->
			<!--				<UserNoteView v-else />-->
			<router-view
				:handle-rename="handleRenameEditorNote"
				:handle-delete="
					() => {
						const item = noteList.find((note) => note.id === activeId)
						handleDeleteNote(item)
					}
				"
				:handle-move="
					() => {
						const item = noteList.find((note) => note.id === activeId)
						handleMoveNote(item)
					}
				"
				:handle-star="
					() => {
						const item = noteList.find((note) => note.id === activeId)
						return handleStarNote(item)
					}
				"
				:handle-more-info="() => handleMoreInfo(activeId)"
			/>
		</el-main>
	</el-container>
</template>

<style scoped></style>
