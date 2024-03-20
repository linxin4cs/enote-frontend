<script setup>
import { ref, onMounted } from 'vue'

import { Chart } from '@antv/g2'

import { Warning, CaretTop, CaretBottom, SemiSelect } from '@element-plus/icons-vue'

let activeUserChart
let activeNoteChart
let usageChart
const activeUserChartRef = ref(null)
const activeNoteChartRef = ref(null)
const usageChartRef = ref(null)

onMounted(() => {
	activeUserChart = renderBarLineChart(activeUserChartRef.value, '活跃用户')
	activeNoteChart = renderBarLineChart(activeNoteChartRef.value, '活跃笔记')
	usageChart = renderUsageChart(usageChartRef.value)
})

function renderBarLineChart(container, title) {
	const chart = new Chart({
		container: container,
		autoFit: true
	})

	const data = [
		{ date: '10:10', activeUser: 2 },
		{ date: '10:15', activeUser: 6 },
		{ date: '10:20', activeUser: 2 },
		{ date: '10:25', activeUser: 9 },
		{ date: '10:30', activeUser: 2 },
		{ date: '10:35', activeUser: 2 },
		{ date: '10:40', activeUser: 1 }
	]

	chart.data(data)

	chart.title({
		title: '03/14 - 03/20 ' + title,
		style: {
			titleFontSize: 20,
			titleFontWeight: 400,
			titleFill: '#2a9a5b'
		}
	})

	chart
		.interval()
		.encode('x', 'date')
		.encode('y', 'activeUser')
		.encode('color', () => '条形')
		.encode('series', () => title)
		.axis('y', { title: title, titleFontSize: 16, labelFontSize: 16 })
		.axis('x', { title: '时间', titleFontSize: 16, labelFontSize: 16 })
		.scale('y', { nice: true })
		.style({
			fill: '#409eff'
		})
		.legend('color', {
			itemLabelFontSize: 16,
			itemMarkerFill: (datum, index, data) => {
				return index === 0 ? '#409eff' : '#2a9a5b'
			},
			layout: {
				alignItems: 'start',
				flexDirection: 'column'
			}
		})

	chart
		.line()
		.encode('x', 'date')
		.encode('y', 'activeUser')
		.encode('color', () => '折线')
		.scale('series', { independent: true })
		.style({
			stroke: '#2a9a5b',
			strokeWidth: 4
		})

	chart.render()

	return chart
}

function renderUsageChart(container) {
	const chart = new Chart({
		container: container,
		autoFit: true
	})

	chart.title({
		title: '存储用量',
		style: {
			titleFill: '#2a9a5b',
			titleFontSize: 20
		}
	})

	const data = [
		{ name: '10:10', usage: 2 },
		{ name: '10:15', usage: 6 },
		{ name: '10:20', usage: 2 },
		{ name: '10:25', usage: 9 }
	]

	chart.coordinate({ type: 'theta' })

	chart
		.interval()
		.data(data)
		.transform({ type: 'stackY' })
		.encode('y', 'usage')
		.encode('color', 'name')
		.scale('color', {
			range: ['#84cbaaff', '#fef1aaff', '#fdbb73ff', '#68b7f8']
		})
		.tooltip((data) => ({
			name: data.name,
			value: '30.21 MB'
		}))
		.legend(false)

	chart.render()

	return chart
}

const dailyNewUser = ref(0)
</script>

<template>
	<div>
		<div class="hover:shadow mb-2 border rounded px-8 py-4">
			<div class="flex flex-wrap">
				<div class="grow flex flex-wrap">
					<div class="mb-4 grow">
						<el-statistic :value="dailyNewUser">
							<template #title>
								<div class="flex items-center text-xl">
									<span class="text-[#2a9a5b]">日新增用户</span>
									<el-tooltip effect="dark" content="一天内新注册的用户数" placement="top">
										<el-icon color="#2a9a5b" class="cursor-pointer">
											<Warning class="text-base" />
										</el-icon>
									</el-tooltip>
								</div>
							</template>
						</el-statistic>
						<div class="text-sm">
							<span class="text-gray-500">较昨日</span>
							<span class="text-[#67c23aff]">
								24%
								<el-icon>
									<CaretTop />
								</el-icon>
							</span>
						</div>
					</div>

					<div class="mb-4 grow">
						<el-statistic :value="98500">
							<template #title>
								<div class="flex items-center text-xl">
									<span class="text-[#2a9a5b]">日新增笔记</span>
									<el-tooltip effect="dark" content="一天内新创建的笔记数" placement="top">
										<el-icon color="#2a9a5b" class="cursor-pointer">
											<Warning class="text-base" />
										</el-icon>
									</el-tooltip>
								</div>
							</template>
						</el-statistic>
						<div class="text-sm">
							<span class="text-gray-500">较昨日</span>
							<span class="text-[#909399ff]">
								0%
								<el-icon><SemiSelect /></el-icon>
							</span>
						</div>
					</div>
				</div>
				<div class="grow flex flex-wrap">
					<div class="mb-4 grow">
						<el-statistic :value="98500">
							<template #title>
								<div class="flex items-center text-xl">
									<span class="text-[#2a9a5b]">日活跃用户</span>
									<el-tooltip effect="dark" content="一天内登录的用户数" placement="top">
										<el-icon color="#2a9a5b" class="cursor-pointer">
											<Warning class="text-base" />
										</el-icon>
									</el-tooltip>
								</div>
							</template>
						</el-statistic>
						<div class="text-sm">
							<span class="text-gray-500">较昨日</span>
							<span class="text-[#f56c6cff]">
								24%
								<el-icon>
									<CaretBottom />
								</el-icon>
							</span>
						</div>
					</div>
					<div class="mb-4 grow">
						<el-statistic :value="98500">
							<template #title>
								<div class="flex items-center text-xl">
									<span class="text-[#2a9a5b]">日活跃笔记</span>
									<el-tooltip
										effect="dark"
										content="一天内被创建、编辑、删除的笔记数"
										placement="top"
									>
										<el-icon color="#2a9a5b" class="cursor-pointer">
											<Warning class="text-base" />
										</el-icon>
									</el-tooltip>
								</div>
							</template>
						</el-statistic>
						<div class="text-sm">
							<span class="text-gray-500">较昨日</span>
							<span>
								24%
								<el-icon>
									<CaretTop />
								</el-icon>
							</span>
						</div>
					</div>
				</div>
			</div>
			<el-divider />
			<div class="flex flex-wrap justify-between">
				<div class="w-full lg:w-[50%] border rounded hover:shadow-lg">
					<div ref="activeUserChartRef" class="ml-[-0.5rem] h-80"></div>
				</div>
				<div class="w-full lg:w-[50%] border rounded hover:shadow-lg">
					<div ref="activeNoteChartRef" class="ml-[-0.5rem] h-80"></div>
				</div>
			</div>
		</div>

		<div class="hover:shadow mb-2 border rounded px-8 py-4">
			<div class="flex flex-wrap">
				<div class="grow flex flex-wrap">
					<div class="mb-4 grow">
						<el-statistic :value="dailyNewUser">
							<template #title>
								<div class="flex items-center text-xl">
									<span class="text-[#2a9a5b]">笔记数</span>
									<el-tooltip effect="dark" content="所有用户创建的总和笔记数" placement="top">
										<el-icon color="#2a9a5b" class="cursor-pointer">
											<Warning class="text-base" />
										</el-icon>
									</el-tooltip>
								</div>
							</template>
						</el-statistic>
						<div class="text-sm">
							<span class="text-gray-500">较昨日</span>
							<span class="text-[#67c23aff]">
								24%
								<el-icon>
									<CaretTop />
								</el-icon>
							</span>
						</div>
					</div>

					<div class="mb-4 grow">
						<el-statistic :value="98500">
							<template #title>
								<div class="flex items-center text-xl">
									<span class="text-[#2a9a5b]">图片数</span>
									<el-tooltip effect="dark" content="所有用户上传的总和图片数" placement="top">
										<el-icon color="#2a9a5b" class="cursor-pointer">
											<Warning class="text-base" />
										</el-icon>
									</el-tooltip>
								</div>
							</template>
						</el-statistic>
						<div class="text-sm">
							<span class="text-gray-500">较昨日</span>
							<span class="text-[#909399ff]">
								0%
								<el-icon><SemiSelect /></el-icon>
							</span>
						</div>
					</div>
				</div>
				<div class="grow flex flex-wrap">
					<div class="mb-4 grow">
						<el-statistic :value="98500">
							<template #title>
								<div class="flex items-center text-xl">
									<span class="text-[#2a9a5b]">视频数</span>
									<el-tooltip effect="dark" content="所有用户上传的总和视频数" placement="top">
										<el-icon color="#2a9a5b" class="cursor-pointer">
											<Warning class="text-base" />
										</el-icon>
									</el-tooltip>
								</div>
							</template>
						</el-statistic>
						<div class="text-sm">
							<span class="text-gray-500">较昨日</span>
							<span class="text-[#f56c6cff]">
								24%
								<el-icon>
									<CaretBottom />
								</el-icon>
							</span>
						</div>
					</div>
					<div class="mb-4 grow">
						<el-statistic :value="98500">
							<template #title>
								<div class="flex items-center text-xl">
									<span class="text-[#2a9a5b]">音频数</span>
									<el-tooltip effect="dark" content="所有用户上传的总和音频数" placement="top">
										<el-icon color="#2a9a5b" class="cursor-pointer">
											<Warning class="text-base" />
										</el-icon>
									</el-tooltip>
								</div>
							</template>
						</el-statistic>
						<div class="text-sm">
							<span class="text-gray-500">较昨日</span>
							<span>
								24%
								<el-icon>
									<CaretTop />
								</el-icon>
							</span>
						</div>
					</div>
				</div>
			</div>
			<el-divider />
			<div class="flex flex-wrap justify-between border rounded hover:shadow-lg">
				<div class="w-full lg:w-[50%]">
					<div ref="usageChartRef" class="h-80"></div>
				</div>
				<div class="w-full lg:w-[50%] p-5 lg:px-0">
					<div class="text-xl text-[#409eff] font-bold mt-4 ml-[-3px]">总用量：985.37 MB</div>
					<ul class="mt-2 text-lg ml-[-3px]">
						<li class="flex items-center mb-1">
							<div class="h-3.5 w-3.5 bg-[#84cbaaff] rounded mr-1" />
							笔记：123.45 MB
						</li>
						<li class="flex items-center mb-1">
							<div class="h-3.5 w-3.5 bg-[#fef1aaff] rounded mr-1" />
							图片：123.45 MB
						</li>
						<li class="flex items-center mb-1">
							<div class="h-3.5 w-3.5 bg-[#fdbb73ff] rounded mr-1" />
							视频：123.45 MB
						</li>
						<li class="flex items-center mb-1">
							<div class="h-3.5 w-3.5 bg-[#68b7f8] rounded mr-1" />
							音频：123.45 MB
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
