<script setup>
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, unref, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
	editorId: {
		type: String,
		default: 'editor'
	},
	height: {
		type: String,
		default: '500px'
	},
	editorConfig: {
		type: Object,
		default: () => undefined
	},
	modelValue: {
		type: String,
		default: ''
	}
})

const emit = defineEmits(['change', 'update:modelValue'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

const valueHtml = ref('')

watch(
	() => props.modelValue,
	(val) => {
		if (val === unref(valueHtml)) return
		valueHtml.value = val
	},
	{
		immediate: true
	}
)

// 监听
watch(
	() => valueHtml.value,
	(val) => {
		emit('update:modelValue', val)
	}
)

const handleCreated = (editor) => {
	editorRef.value = editor
}

// 编辑器配置
const editorConfig = computed(() => {
	return Object.assign(
		{
			readOnly: false,
			customAlert: (s, t) => {
				switch (t) {
					case 'success':
						ElMessage.success(s)
						break
					case 'info':
						ElMessage.info(s)
						break
					case 'warning':
						ElMessage.warning(s)
						break
					case 'error':
						ElMessage.error(s)
						break
					default:
						ElMessage.info(s)
						break
				}
			},
			autoFocus: false,
			scroll: true,
			uploadImgShowBase64: true
		},
		props.editorConfig || {}
	)
})

const editorStyle = computed(() => {
	return {
		height: toString.call(props.height) === `[object Number]` ? `${props.height}px` : props.height
	}
})

// 回调函数
const handleChange = (editor) => {
	emit('change', editor)
}

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
	const editor = unref(editorRef.value)

	// 销毁，并移除 editor
	editor?.destroy()
})

const getEditorRef = async () => {
	await nextTick()
	return unref(editorRef.value)
}

defineExpose({
	getEditorRef
})
</script>

<template>
	<div class="border-1 border-solid border-[var(--el-border-color)] z-10">
		<!-- 工具栏 -->
		<Toolbar
			:editor="editorRef"
			:editorId="editorId"
			class="border-0 b-b-1 border-solid border-[var(--el-border-color)]"
		/>
		<!-- 编辑器 -->
		<Editor
			v-model="valueHtml"
			:editorId="editorId"
			:defaultConfig="editorConfig"
			:style="editorStyle"
			@on-change="handleChange"
			@on-created="handleCreated"
		/>
	</div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>
