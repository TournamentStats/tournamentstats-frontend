<template>
	<NuxtPage />
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ['authentication'],
})
</script>
