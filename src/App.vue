<template>
	<div class="app">
		<Editor v-model="state"></Editor>
	</div>
</template>

<script>
import { ref } from '@vue/reactivity';
import data from './data.json';
import Editor from './packages/editor';
import { registerConfig as config } from './utils/editor-config';
import { provide } from '@vue/runtime-core';

export default {
	setup() {
		const state = ref(data);

		provide('config', config)

		return {
			state
		}
	},
	components: {
		Editor
	}
}
</script>

<style lang="scss">
.app {
	position: fixed;
	top: 20px;
	left: 20px;
	right: 20px;
	bottom: 20px;
}
</style>
