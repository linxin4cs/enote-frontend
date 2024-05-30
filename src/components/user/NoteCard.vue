<script setup>
import { defineProps } from 'vue'
import { FolderOpen, More, Notes, StarOne } from '@icon-park/vue-next'
import ContextMenu from '@imengyu/vue3-context-menu'
import { formatDateTimeToDate } from '@/utils/format'
import { useRouter } from 'vue-router'
import useStore from '@/utils/store'

const props = defineProps([
	'active',
	'note',
	'handleDeleteNote',
	'handleRenameNote',
	'handleMoveNote',
	'handleStarNote',
	'handleMoreInfo'
])

const router = useRouter()
const query = useStore().asideInfo.query

function highlightTitle() {
	const text = props.note.title

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

function highlightAbstract() {
	const text = props.note.abstractContent

	if (query.isHighlighting) {
		if (query.isCaseSensitive) {
			const highlight = `<span class="highlight">${query.keyword}</span>`
			return text.replace(new RegExp(query.keyword, 'g'), highlight)
		} else {
			const highlight = `<span class="highlight">${query.keyword}</span>`
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
				onClick: props.handleDeleteNote
			},
			{
				label: '重命名',
				onClick: props.handleRenameNote
			},
			{
				label: '移动到',
				onClick: props.handleMoveNote,
				divided: true
			},
			{
				label: props.note.stared === 1 ? '取消收藏' : '收藏',
				onClick: props.handleStarNote,
				divided: true
			},
			{
				label: '更多信息',
				onClick: props.handleMoreInfo
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
		<div class="flex flex-row mb-2 items-center justify-between">
			<div class="flex items-center">
				<notes theme="outline" size="20" fill="#2a9a5b" class="mr-2" />
				<el-tooltip placement="right" :content="note.title">
					<span
						class="text-sm whitespace-nowrap overflow-hidden text-ellipsis hover:underline underline-offset-4"
						v-html="highlightTitle()"
					></span>
				</el-tooltip>
			</div>
			<div class="flex items-center">
				<star-one
					theme="filled"
					size="16"
					fill="#fec433ff"
					class="group-hover:hidden"
					v-if="note.stared === 1"
				/>
				<div
					class="hover:bg-[#e1e6ecff] rounded hidden group-hover:flex group-hover:items-center ml-auto"
					@click.stop=""
				>
					<more theme="filled" size="20" fill="#939cadff" @click="onContextMenu" />
				</div>
			</div>
		</div>
		<span class="text-xs text-gray-500 text-clamp-3 mb-2" v-html="highlightAbstract()"> </span>
		<div class="flex flex-row items-center h-4 ml-0.5" v-if="props.active">
			<folder-open theme="filled" size="14" fill="#c0c0c0" class="mr-1" />
			<el-link target="_blank">
				<span
					class="text-xs whitespace-nowrap overflow-hidden text-ellipsis text-gray-400"
					@click="
						() => {
							const targetPath =
								note.folderInfo.folderId !== 'root'
									? `/folder/${note.folderInfo.folderId}`
									: `/folder`

							console.log(targetPath)

							router.push(targetPath)
						}
					"
					>{{ note.folderInfo.folderName }}</span
				>
			</el-link>
		</div>
		<div class="text-xs text-gray-400" v-if="!props.active">
			{{ formatDateTimeToDate(note.modifiedTime) }}
		</div>
	</div>
</template>

<style>
.text-clamp-3 {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}

.highlight {
	background-color: #f7e7c1ff;
}
</style>
