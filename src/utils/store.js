import { reactive } from 'vue'
import { defineStore } from 'pinia'

const useStore = defineStore('store', () => {
	const userInfo = reactive({
		id: 0,
		email: '',
		name: '',
		role: 0,
		createdAt: '',
		avatar: ''
	})
	const isFeteched = reactive({
		userInfo: false
	})

	return { userInfo, isFeteched }
})

function resetUserInfo() {
	const store = useStore()

	store.userInfo.id = 0
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

export default useStore
export { resetUserInfo, setUserInfo }
