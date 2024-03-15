<script setup>
const props = defineProps(["message"]);
</script>

<template>
	<div class="flex flex-col items-center pt-40">
		<h2 class="text-[#2a9a5b] text-9xl blur-sm">401</h2>
		<p class="text-gray-500 m-4 text-2xl">{{ props.message }}</p>
		<RouterLink to="/"
			><el-button color="#2a9a5b" plain>回到首页</el-button></RouterLink
		>
	</div>
</template>

<style lang="scss" scoped></style>
