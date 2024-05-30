<script setup>
import { onMounted, reactive, ref, watchEffect } from 'vue'

import { Chart } from '@antv/g2'
import DashboardDataCard from '@/components/admin/DashboardDataCard.vue'
import service from '@/utils/request'

onMounted(() => {
	fetchPageData()

	const newUserChart = renderBarLineChart(newUserCharRef.value, '新增用户', newUserChartData.value)
	const activeUserChart = renderBarLineChart(
		activeUserChartRef.value,
		'活跃用户',
		activeUserChartData.value
	)
	const newNoteChart = renderBarLineChart(newNoteCharRef.value, '新增笔记', newNoteChartData.value)
	const activeNoteChart = renderBarLineChart(
		activeNoteChartRef.value,
		'活跃笔记',
		activeNoteChartData.value
	)
	const usageChart = renderPieChart(usageChartRef.value, '存储用量', usageChartData.value)

	// 观察数据变化并更新图表
	watchEffect(() => {
		if (newUserChartData.value.length > 0) {
			newUserChart.changeData(newUserChartData.value)
		}
		if (activeUserChartData.value.length > 0) {
			activeUserChart.changeData(activeUserChartData.value)
		}
		if (newNoteChartData.value.length > 0) {
			newNoteChart.changeData(newNoteChartData.value)
		}
		if (activeNoteChartData.value.length > 0) {
			activeNoteChart.changeData(activeNoteChartData.value)
		}
		if (usageChartData.value.length > 0) {
			usageChart.changeData(usageChartData.value)
		}
	})
})

const totalUser = reactive({
	num: 0,
	percent: '0.00%'
})
const newUser = reactive({
	num: 0,
	percent: '0.00%'
})
const activeUser = reactive({
	num: 0,
	percent: '0.00%'
})
const noteCount = reactive({
	num: 0,
	percent: '0.00%'
})
const newNote = reactive({
	num: 0,
	percent: '0.00%'
})
const activeNote = reactive({
	num: 0,
	percent: '0.00%'
})
const newUserChartData = ref([])
const activeUserChartData = ref([])
const newNoteChartData = ref([])
const activeNoteChartData = ref([])

const imageCount = reactive({
	num: 0,
	percent: '0.00%'
})
const videoCount = reactive({
	num: 0,
	percent: '0.00%'
})
const audioCount = reactive({
	num: 0,
	percent: '0.00%'
})
const usageChartData = ref([])
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

const newUserCharRef = ref(null)
const newNoteCharRef = ref(null)
const activeUserChartRef = ref(null)
const activeNoteChartRef = ref(null)
const usageChartRef = ref(null)

function renderBarLineChart(container, title, data = []) {
	const today = new Date()
	const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
	// 格式化成 04/01 这样的字符串，如果为个位数则补 0
	const format = (num) => (num < 10 ? '0' + num : num)
	const todayStr = format(today.getMonth() + 1) + '/' + format(today.getDate())
	const lastWeekStr = format(lastWeek.getMonth() + 1) + '/' + format(lastWeek.getDate())
	const baseTitleStr = lastWeekStr + ' - ' + todayStr + ' '

	const chart = new Chart({
		container: container,
		autoFit: true
	})

	chart.data(data)

	chart.title({
		title: baseTitleStr + title,
		style: {
			titleFontSize: 20,
			titleFontWeight: 400,
			titleFill: '#2a9a5b'
		}
	})

	chart
		.interval()
		.encode('x', 'date')
		.encode('y', 'num')
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
		.encode('y', 'num')
		.encode('color', () => '折线')
		.scale('series', { independent: true })
		.style({
			stroke: '#2a9a5b',
			strokeWidth: 4
		})

	chart.render()

	return chart
}

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

function fetchPageData() {
	fetchUserData()
	fetchNoteData()
	fetchFileData()
	fetchUsageData()
}

function fetchUserData() {
	service
		.get('/api/admin/dashboard/user/total')
		.then((res) => {
			totalUser.num = res.data.num
			totalUser.percent = res.data.percent
		})
		.catch((err) => {
			console.error(err)
		})

	service
		.get('/api/admin/dashboard/user/daily/new')
		.then((res) => {
			newUser.num = res.data.num
			newUser.percent = res.data.percent
		})
		.catch((err) => {
			console.error(err)
		})

	service
		.get('/api/admin/dashboard/user/daily/active')
		.then((res) => {
			activeUser.num = res.data.num
			activeUser.percent = res.data.percent
		})
		.catch((err) => {
			console.error(err)
		})

	service
		.get('api/admin/dashboard/user/weekly/new')
		.then((res) => {
			newUserChartData.value = res.data.data
		})
		.catch((err) => {
			console.error(err)
		})

	service
		.get('api/admin/dashboard/user/weekly/active')
		.then((res) => {
			activeUserChartData.value = res.data.data
		})
		.catch((err) => {
			console.error(err)
		})
}

function fetchNoteData() {
	service
		.get('/api/admin/dashboard/note/total')
		.then((res) => {
			noteCount.num = res.data.num
			noteCount.percent = res.data.percent
		})
		.catch((err) => {
			console.error(err)
		})

	service
		.get('/api/admin/dashboard/note/daily/new')
		.then((res) => {
			newNote.num = res.data.num
			newNote.percent = res.data.percent
		})
		.catch((err) => {
			console.error(err)
		})

	service
		.get('/api/admin/dashboard/note/daily/active')
		.then((res) => {
			activeNote.num = res.data.num
			activeNote.percent = res.data.percent
		})
		.catch((err) => {
			console.error(err)
		})

	service
		.get('api/admin/dashboard/note/weekly/new')
		.then((res) => {
			newNoteChartData.value = res.data.data
		})
		.catch((err) => {
			console.error(err)
		})

	service
		.get('api/admin/dashboard/note/weekly/active')
		.then((res) => {
			activeNoteChartData.value = res.data.data
		})
		.catch((err) => {
			console.error(err)
		})
}

function fetchFileData() {
	service
		.get('/api/admin/dashboard/file/total/image')
		.then((res) => {
			imageCount.num = res.data.num
			imageCount.percent = res.data.percent
		})
		.catch((err) => {
			console.error(err)
		})

	service
		.get('/api/admin/dashboard/file/total/video')
		.then((res) => {
			videoCount.num = res.data.num
			videoCount.percent = res.data.percent
		})
		.catch((err) => {
			console.error(err)
		})

	service
		.get('/api/admin/dashboard/file/total/audio')
		.then((res) => {
			audioCount.num = res.data.num
			audioCount.percent = res.data.percent
		})
		.catch((err) => {
			console.error(err)
		})
}

function fetchUsageData() {
	service
		.get('/api/admin/dashboard/usage')
		.then((res) => {
			usageData.total = res.data.total
			usageData.note = res.data.note
			usageData.image = res.data.image
			usageData.video = res.data.video
			usageData.audio = res.data.audio

			usageChartData.value = [
				{ name: '笔记', rawSize: usageData.note.rawSize, parsedSize: usageData.note.parsedSize },
				{ name: '图片', rawSize: usageData.image.rawSize, parsedSize: usageData.image.parsedSize },
				{ name: '视频', rawSize: usageData.video.rawSize, parsedSize: usageData.video.parsedSize },
				{ name: '音频', rawSize: usageData.audio.rawSize, parsedSize: usageData.audio.parsedSize }
			]
		})
		.catch((err) => {
			console.error(err)
		})
}
</script>

<template>
	<div>
		<div class="hover:shadow mb-2 border rounded px-8 py-4">
			<div class="flex flex-wrap mb-4 gap-2">
				<DashboardDataCard :data="totalUser" title="总用户" />
				<DashboardDataCard :data="newUser" title="日新增用户" tooltip="一天内新注册的用户数" />
				<DashboardDataCard :data="activeUser" title="日活跃用户" tooltip="一天内登录的用户数" />
			</div>
			<div class="flex flex-wrap gap-2">
				<DashboardDataCard :data="noteCount" title="总笔记" tooltip="所有用户创建的总和笔记数" />
				<DashboardDataCard :data="newNote" title="日新增笔记" tooltip="一天内新创建的笔记数" />
				<DashboardDataCard
					:data="activeNote"
					title="日活跃笔记"
					tooltip="一天内被创建、编辑的笔记数"
				/>
			</div>
			<el-divider />
			<div class="flex flex-wrap justify-between">
				<div class="w-full lg:w-[50%] border rounded hover:shadow-lg">
					<div ref="newUserCharRef" class="ml-[-0.5rem] h-80"></div>
				</div>
				<div class="w-full lg:w-[50%] border rounded hover:shadow-lg">
					<div ref="activeUserChartRef" class="ml-[-0.5rem] h-80"></div>
				</div>
			</div>
			<div class="flex flex-wrap justify-between">
				<div class="w-full lg:w-[50%] border rounded hover:shadow-lg">
					<div ref="newNoteCharRef" class="ml-[-0.5rem] h-80"></div>
				</div>
				<div class="w-full lg:w-[50%] border rounded hover:shadow-lg">
					<div ref="activeNoteChartRef" class="ml-[-0.5rem] h-80"></div>
				</div>
			</div>
		</div>

		<div class="hover:shadow mb-2 border rounded px-8 py-4">
			<div class="flex flex-wrap gap-2">
				<DashboardDataCard :data="imageCount" title="图片数" tooltip="所有用户上传的总和图片数" />
				<DashboardDataCard :data="videoCount" title="视频数" tooltip="所有用户上传的总和视频数" />
				<DashboardDataCard :data="audioCount" title="音频数" tooltip="所有用户上传的总和音频数" />
			</div>
			<el-divider />
			<div class="flex flex-wrap justify-between border rounded hover:shadow-lg">
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
	</div>
</template>
