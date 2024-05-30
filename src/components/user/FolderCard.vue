<script setup>
import { defineProps, h } from 'vue'
import { FolderOpen, More } from '@icon-park/vue-next'
import ContextMenu from '@imengyu/vue3-context-menu'
import { ElMessageBox } from 'element-plus'
import { formatDateTimeToDate, formatDateTimeToFull } from '@/utils/format'
import useStore from '@/utils/store'
import { useRouter } from 'vue-router'

const props = defineProps([
	'active',
	'folder',
	'handleDeleteFolder',
	'handleRenameFolder',
	'handleMoveFolder'
])

const query = useStore().asideInfo.query

function highlightText() {
	const text = props.folder.name

	if (query.isHighlighting) {
		if (query.isCaseSensitive) {
			const highlight = `<span class="highlight">${query.keyword}</span>`
			return text.replace(new RegExp(query.keyword, 'g'), highlight)
		} else {
			const highlight = (match) => `<span class="highlight">${match}</span>`
			return text.replace(new RegExp(query.keyword, 'gi'), highlight)
		}
	} else {
		return text
	}
}

function onContextMenu(e) {
	e.preventDefault()

	ContextMenu.showContextMenu({
		x: e.x,
		y: e.y,
		items: [
			{
				label: '删除',
				onClick: props.handleDeleteFolder
			},
			{
				label: '重命名',
				onClick: props.handleRenameFolder
			},
			{
				label: '移动到',
				divided: true,
				onClick: props.handleMoveFolder
			},
			{
				label: '更多信息',
				onClick: () => {
					ElMessageBox.confirm(
						h('div', { class: 'text-base' }, [
							h(
								'p',
								{ class: 'mb-2' },
								'更新于： ' + ' ' + formatDateTimeToFull(props.folder.updatedAt)
							),
							h('p', { class: 'mb-2' }, '笔记数量： ' + ' ' + props.folder.noteCount),
							h('p', { class: 'mb-2' }, '文件夹数量： ' + ' ' + props.folder.subFolderCount)
						]),
						{
							title: props.folder.name,
							showConfirmButton: false,
							showCancelButton: false
						}
					)
				}
			}
		]
	})
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
			<folder-open theme="outline" size="20" fill="#ffba4aff" class="mr-2" />
			<el-tooltip placement="right" :content="folder.name">
				<span
					class="text-sm whitespace-nowrap overflow-hidden text-ellipsis hover:underline underline-offset-4"
					v-html="highlightText()"
				></span>
			</el-tooltip>
			<div
				class="hover:bg-[#e1e6ecff] rounded hidden group-hover:flex group-hover:items-center ml-auto"
				@click.stop=""
			>
				<more theme="filled" size="20" fill="#939cadff" @click="onContextMenu" />
			</div>
		</div>
		<div class="text-xs text-gray-400">
			{{ formatDateTimeToDate(folder.updatedAt) }}
		</div>
	</div>
</template>
<style>
.highlight {
	background-color: #f7e7c1ff;
}
</style>
