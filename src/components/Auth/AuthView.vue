<script setup></script>

<template>
	<div class="flex justify-center items-center h-screen">
		<div class="border-2 flex rounded-lg p-6 shadow-md">
			<router-view v-slot="{ Component }">
				<transition name="el-fade-in-linear" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</div>
	</div>
</template>
