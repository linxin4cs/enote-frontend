<script setup>
import { Left } from '@icon-park/vue-next'
import { useRouter } from 'vue-router'

const props = defineProps({
	title: {
		type: String,
		default: ''
	},
	showBack: {
		type: Boolean,
		default: true
	},
	handleBackClick: {
		type: Function,
		default: () => {}
	}
})

const router = useRouter()
</script>

<template>
	<transition name="el-fade-in-linear" mode="out-in">
		<div class="flex flex-row items-center" v-if="showBack">
			<left
				theme="outline"
				size="20"
				fill="#50576cff"
				:strokeWidth="3"
				class="cursor-pointer mr-4"
				@click="handleBackClick"
			/>
			<el-tooltip placement="bottom-start" :content="title">
				<div
					class="text-[#50576cff] text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis grow"
				>
					{{ title }}
				</div>
			</el-tooltip>
		</div>
		<div class="flex flex-row items-center" v-else>
			<el-tooltip placement="bottom-start" :content="title">
				<div
					class="text-[#50576cff] text-sm font-bold whitespace-nowrap overflow-hidden text-ellipsis grow"
				>
					{{ title }}
				</div>
			</el-tooltip>
		</div>
	</transition>
</template>

<style scoped></style>
