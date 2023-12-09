<script setup lang="ts">
defineProps({
  title: String,
  price: Number,
  isAdded: Boolean
})
</script>

<template>
  <div class="product">
    <h1>{{ title }}</h1>
    <h2>{{ price }}</h2>
    <h3>{{ isAdded }}</h3>
    <slot />
  </div>
</template>

<style scoped>
.product {
  border: 1px solid blue;
}
</style>
