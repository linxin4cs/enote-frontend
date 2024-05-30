<script setup>
import ContextMenu from '@imengyu/vue3-context-menu'
import { More, TagOne } from '@icon-park/vue-next'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '@/utils/store'

const props = defineProps(['active', 'tag', 'handleDeleteTag', 'handleRenameTag'])
const router = useRouter()

const query = useStore().asideInfo.query

function onContextMenu(e) {
	e.preventDefault()

	ContextMenu.showContextMenu({
		x: e.x,
		y: e.y,
		items: [
			{
				label: '删除',
				onClick: props.handleDeleteTag
			},
			{
				label: '重命名',
				onClick: props.handleRenameTag
			}
		]
	})
}

function highlightName() {
	const text = props.tag.name

	if (query.isHighlighting) {
		if (query.isCaseSensitive) {
			const highlight = `<span class="highlight">${query.keyword}</span>`
			return text.replace(new RegExp(query.keyword, 'g'), highlight)
		} else {
			// 在这里使用匿名函数返回匹配的原始文本（保持原样）和高亮的 HTML 标签
			const highlight = (match) => `<span class="highlight">${match}</span>`
			return text.replace(new RegExp(query.keyword, 'gi'), highlight)
		}
	} else {
		return text
	}
}
</script>

<template>
	<div
		:class="
			props.active
				? 'cursor-pointer bg-[#f4f6f7ff] p-3 rounded border-b border-transparent group last:mb-10'
				: 'cursor-pointer hover:bg-[#f4f6f7ff] p-3 rounded border-b hover:border-transparent group last:mb-10'
		"
		@click.right="onContextMenu"
	>
		<div class="flex flex-row mb-2 items-center">
			<tag-one theme="outline" size="20" fill="#4a90e2" class="mr-2" />
			<el-tooltip placement="right" :content="tag.name">
				<span
					class="text-sm whitespace-nowrap overflow-hidden text-ellipsis hover:underline underline-offset-4"
					v-html="highlightName()"
				></span>
			</el-tooltip>
			<div
				class="hover:bg-[#e1e6ecff] rounded hidden group-hover:flex group-hover:items-center ml-auto"
				@click.stop=""
			>
				<more theme="filled" size="20" fill="#939cadff" @click="onContextMenu" />
			</div>
		</div>
		<div class="text-xs text-gray-400">{{ tag.noteCount }} 个笔记</div>
	</div>
</template>

<style scoped></style>
