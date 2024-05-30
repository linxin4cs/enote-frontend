import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

const useStore = defineStore('store', () => {
	const userInfo = reactive({
		id: '',
		email: '',
		name: '',
		role: 0,
		createdAt: '',
		avatar: ''
	})
	const isFeteched = reactive({
		userInfo: false
	})

	const asideInfo = reactive({
		query: {
			keyword: '',
			isCaseSensitive: 0,
			isHighlighting: false,
			searchScope: 1,
			currentFolderPage: 1,
			currentNotePage: 1,
			currentTagPage: 1,
			pageSize: 15,
			totalNotesPage: 0,
			totalFoldersPage: 0,
			totalTagsPage: 0
		}
	})

	const currentNote = reactive({
		id: '',
		title: '',
		modifiedTime: '',
		stared: 0,
		abstractContent: '',
		folderInfo: {
			folderId: '',
			folderName: ''
		}
	})

	const deviceType = ref('移动设备')

	return { userInfo, isFeteched, asideInfo, deviceType, currentNote }
})

function resetUserInfo() {
	const store = useStore()

	store.userInfo.id = ''
	store.userInfo.email = ''
	store.userInfo.name = ''
	store.userInfo.role = 0
	store.userInfo.createdAt = ''
	store.userInfo.avatar = ''
}

function setUserInfo(data) {
	const store = useStore()

	store.userInfo.id = data.id
	store.userInfo.email = data.email
	store.userInfo.name = data.name
	store.userInfo.role = data.role
	store.userInfo.createdAt = data.createdAt
	store.userInfo.avatar = data.avatar
}

function resetQuery() {
	const store = useStore()

	store.asideInfo.query.keyword = ''
	store.asideInfo.query.isCaseSensitive = 0
	store.asideInfo.query.isHighlighting = false
	store.asideInfo.query.searchScope = 1
	store.asideInfo.query.currentFolderPage = 1
	store.asideInfo.query.currentNotePage = 1
	store.asideInfo.query.currentTagPage = 1
	store.asideInfo.query.pageSize = 15
	store.asideInfo.query.totalNotesPage = 0
	store.asideInfo.query.totalFoldersPage = 0
	store.asideInfo.query.totalTagsPage = 0
}

function resetCurrentNote() {
	const store = useStore()

	store.currentNote.id = ''
	store.currentNote.title = ''
	store.currentNote.modifiedTime = ''
	store.currentNote.stared = 0
	store.currentNote.abstractContent = ''
	store.currentNote.folderInfo.folderId = ''
	store.currentNote.folderInfo.folderName = ''
}

export default useStore
export { resetUserInfo, setUserInfo, resetQuery, resetCurrentNote }
