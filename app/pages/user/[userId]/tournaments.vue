<template>
	<div>
		here should be all tournaments of user, requested with api
		userId: {{ userId }}
	</div>
</template>

<script lang="ts" setup>
definePageMeta({
})

const userId = useRoute().params.userId
</script>

<style></style>
