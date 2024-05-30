<script setup>
import { FolderOpen, Notes, Star, TagOne } from '@icon-park/vue-next'

const props = defineProps(['page'])
</script>

<template>
	<div class="flex h-full w-full items-center overflow-hidden">
		<notes
			theme="outline"
			size="128"
			fill="#e0e1e5ff"
			:strokeWidth="4"
			class="mx-auto"
			v-if="page === 'latest'"
		/>
		<folder-open
			theme="outline"
			size="128"
			fill="#e0e1e5ff"
			:strokeWidth="4"
			class="mx-auto"
			v-if="page === 'folder'"
		/>
		<star theme="outline" size="128" fill="#e0e1e5ff" class="mx-auto" v-if="page === 'star'" />
		<tag-one
			theme="outline"
			size="128"
			fill="#e0e1e5ff"
			:strokeWidth="4"
			class="mx-auto"
			v-if="page === 'tag'"
		/>
	</div>
</template>

<style scoped></style>
