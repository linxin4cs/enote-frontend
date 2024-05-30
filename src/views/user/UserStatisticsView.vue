<script setup>
import { Chart } from '@antv/g2'
import { computed, onMounted, reactive, ref, watchEffect } from 'vue'
import service from '@/utils/request'

const countData = reactive({
	note: 0,
	folder: 0,
	tag: 0,
	stared: 0,
	image: 0,
	video: 0,
	audio: 0
})
const usageChartRef = ref(null)
const usageData = reactive({
	total: {
		rawSize: 0,
		parsedSize: '0.00 KB'
	},
	note: {
		rawSize: 0,
		parsedSize: '0.00 KB'
	},
	image: {
		rawSize: 0,
		parsedSize: '0.00 KB'
	},
	video: {
		rawSize: 0,
		parsedSize: '0.00 KB'
	},
	audio: {
		rawSize: 0,
		parsedSize: '0.00 KB'
	}
})
const usageChartData = computed(() => [
	{ name: '笔记', rawSize: usageData.note.rawSize, parsedSize: usageData.note.parsedSize },
	{ name: '图片', rawSize: usageData.image.rawSize, parsedSize: usageData.image.parsedSize },
	{ name: '视频', rawSize: usageData.video.rawSize, parsedSize: usageData.video.parsedSize },
	{ name: '音频', rawSize: usageData.audio.rawSize, parsedSize: usageData.audio.parsedSize }
])

function renderPieChart(container, title, data = []) {
	const chart = new Chart({
		container: container,
		autoFit: true
	})

	chart.title({
		title: title,
		style: {
			titleFill: '#2a9a5b',
			titleFontSize: 20
		}
	})

	chart.coordinate({ type: 'theta' })

	chart
		.interval()
		.data(data)
		.transform({ type: 'stackY' })
		.encode('y', 'rawSize')
		.encode('color', 'name')
		.scale('color', {
			range: ['#84cbaaff', '#fef1aaff', '#fdbb73ff', '#68b7f8']
		})
		.tooltip((data) => ({
			name: data.name,
			value: data.parsedSize
		}))
		.legend(false)

	chart.render()

	return chart
}

function fetchCountData() {
	service
		.get('/api/statistics/count')
		.then((res) => {
			countData.note = res.data.note
			countData.folder = res.data.folder
			countData.tag = res.data.tag
			countData.stared = res.data.stared
			countData.image = res.data.image
			countData.video = res.data.video
			countData.audio = res.data.audio
		})
		.catch((err) => {
			console.error(err)
		})
}

function fetchUsageData() {
	service
		.get('/api/statistics/usage')
		.then((res) => {
			usageData.total = res.data.total
			usageData.note = res.data.note
			usageData.image = res.data.image
			usageData.video = res.data.video
			usageData.audio = res.data.audio

			// usageChartData.value = [
			// 	{ name: '笔记', rawSize: usageData.note.rawSize, parsedSize: usageData.note.parsedSize },
			// 	{ name: '图片', rawSize: usageData.image.rawSize, parsedSize: usageData.image.parsedSize },
			// 	{ name: '视频', rawSize: usageData.video.rawSize, parsedSize: usageData.video.parsedSize },
			// 	{ name: '音频', rawSize: usageData.audio.rawSize, parsedSize: usageData.audio.parsedSize }
			// ]
		})
		.catch((err) => {
			console.error(err)
		})
}

function fetchPageData() {
	fetchUsageData()
	fetchCountData()
}

onMounted(() => {
	fetchPageData()
	const usageChart = renderPieChart(usageChartRef.value, '存储用量', usageChartData.value)

	// 观察数据变化并更新图表
	watchEffect(() => {
		usageChart.changeData(usageChartData.value)
	})
})
</script>

<template>
	<div class="flex flex-col items-start justify-start flex-wrap">
		<h2 class="text-3xl text-[#2a9a5b]">数据统计</h2>
		<h3 class="text-xl text-[#6ab88c] my-4">概览</h3>
		<div class="flex flex-row items-center justify-start flex-wrap gap-4 mb-3">
			<div class="shadow p-2 rounded border min-w-40">
				<el-statistic
					:value="countData.note"
					:value-style="{ fontSize: '1.8rem', marginLeft: '0.1rem' }"
				>
					<template #title>
						<div class="flex items-center text-xl">
							<span class="text-[#2a9a5b] text-nowrap">笔记</span>
						</div>
					</template>
				</el-statistic>
			</div>
			<div class="shadow p-2 rounded border min-w-40">
				<el-statistic
					:value="countData.folder"
					:value-style="{ fontSize: '1.8rem', marginLeft: '0.1rem' }"
				>
					<template #title>
						<div class="flex items-center text-xl">
							<span class="text-[#2a9a5b] text-nowrap">文件夹</span>
						</div>
					</template>
				</el-statistic>
			</div>
			<div class="shadow p-2 rounded border min-w-40">
				<el-statistic
					:value="countData.tag"
					:value-style="{ fontSize: '1.8rem', marginLeft: '0.1rem' }"
				>
					<template #title>
						<div class="flex items-center text-xl">
							<span class="text-[#2a9a5b] text-nowrap">标签</span>
						</div>
					</template>
				</el-statistic>
			</div>
			<div class="shadow p-2 rounded border min-w-40">
				<el-statistic
					:value="countData.stared"
					:value-style="{ fontSize: '1.8rem', marginLeft: '0.1rem' }"
				>
					<template #title>
						<div class="flex items-center text-xl">
							<span class="text-[#2a9a5b] text-nowrap">收藏</span>
						</div>
					</template>
				</el-statistic>
			</div>
		</div>
		<div class="flex flex-row items-center justify-start flex-wrap gap-4">
			<div class="shadow p-2 rounded border min-w-40">
				<el-statistic
					:value="countData.image"
					:value-style="{ fontSize: '1.8rem', marginLeft: '0.1rem' }"
				>
					<template #title>
						<div class="flex items-center text-xl">
							<span class="text-[#2a9a5b] text-nowrap">图片</span>
						</div>
					</template>
				</el-statistic>
			</div>
			<div class="shadow p-2 rounded border min-w-40">
				<el-statistic
					:value="countData.video"
					:value-style="{ fontSize: '1.8rem', marginLeft: '0.1rem' }"
				>
					<template #title>
						<div class="flex items-center text-xl">
							<span class="text-[#2a9a5b] text-nowrap">视频</span>
						</div>
					</template>
				</el-statistic>
			</div>
			<div class="shadow p-2 rounded border min-w-40">
				<el-statistic
					:value="countData.audio"
					:value-style="{ fontSize: '1.8rem', marginLeft: '0.1rem' }"
				>
					<template #title>
						<div class="flex items-center text-xl">
							<span class="text-[#2a9a5b] text-nowrap">音频</span>
						</div>
					</template>
				</el-statistic>
			</div>
		</div>
		<h3 class="text-xl text-[#6ab88c] my-4">用量</h3>
		<div class="flex flex-wrap justify-between border rounded hover:shadow-lg max-w-[43rem] w-full">
			<div class="w-full lg:w-[50%]">
				<div ref="usageChartRef" class="h-80"></div>
			</div>
			<div class="w-full lg:w-[50%] p-5 lg:px-0">
				<div class="text-xl text-[#409eff] font-bold mt-4 ml-[-3px]">
					总用量：{{ usageData.total.parsedSize }}
				</div>
				<ul class="mt-2 text-lg ml-[-3px]">
					<li class="flex items-center mb-1">
						<div class="h-3.5 w-3.5 bg-[#84cbaaff] rounded mr-1" />
						笔记：{{ usageData.note.parsedSize }}
					</li>
					<li class="flex items-center mb-1">
						<div class="h-3.5 w-3.5 bg-[#fef1aaff] rounded mr-1" />
						图片：{{ usageData.image.parsedSize }}
					</li>
					<li class="flex items-center mb-1">
						<div class="h-3.5 w-3.5 bg-[#fdbb73ff] rounded mr-1" />
						视频：{{ usageData.video.parsedSize }}
					</li>
					<li class="flex items-center mb-1">
						<div class="h-3.5 w-3.5 bg-[#68b7f8] rounded mr-1" />
						音频：{{ usageData.audio.parsedSize }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
