<script setup></script>

<template>
	<div
		class="bg-image flex justify-center lg:justify-end items-center h-screen lg:pr-32"
	>
		<div class="border-2 flex rounded-lg p-6 shadow-lg bg-white">
			<router-view v-slot="{ Component }">
				<transition name="el-fade-in-linear" mode="out-in">
					<component :is="Component" />
				</transition>
			</router-view>
		</div>
	</div>
</template>

<style scoped>
.bg-image {
	background-image: url("@/assets/images/admin_login_bg.svg");
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
}
@media screen and (min-width: 1024px) {
	.bg-image {
		background-size: 60%;
		background-position: left;
	}
}
</style>
