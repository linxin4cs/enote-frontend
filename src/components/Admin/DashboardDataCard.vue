<script setup>
import { computed } from 'vue'
import { CaretBottom, CaretTop, SemiSelect, Warning } from '@element-plus/icons-vue'

const COLOR_MAP = {
	top: '#67c23aff',
	bottom: '#f56c6cff',
	flat: '#909399ff'
}

const props = defineProps(['data', 'title', 'tooltip'])
const percentValue = computed(() => {
	return props.data.percent.replace('-', '')
})
const compare = computed(() => {
	if (percentValue.value === '0.00%') {
		return 'flat'
	}

	return props.data.percent.includes('-') ? 'bottom' : 'top'
})
</script>

<template>
	<div class="flex-1 flex flex-col">
		<el-statistic :value="data.num" :value-style="{ fontSize: '1.8rem', marginLeft: '0.1rem' }">
			<template #title>
				<div class="flex items-center text-xl">
					<span class="text-[#2a9a5b] text-nowrap">{{ title }}</span>
					<el-tooltip
						effect="dark"
						:content="tooltip"
						placement="top"
						v-if="tooltip && tooltip !== ''"
					>
						<el-icon color="#2a9a5b" class="cursor-pointer">
							<Warning class="text-base" />
						</el-icon>
					</el-tooltip>
				</div>
			</template>
		</el-statistic>
		<div class="text-sm text-nowrap">
			<span class="text-gray-500">较昨日</span>
			<span
				:style="{
					color: COLOR_MAP[compare]
				}"
			>
				{{ percentValue }}
				<el-icon>
					<CaretTop v-if="compare === 'top'" />
					<CaretBottom v-else-if="compare === 'bottom'" />
					<SemiSelect v-else-if="compare === 'flat'" />
				</el-icon>
			</span>
		</div>
	</div>
</template>

<style scoped></style>
