<script setup lang="ts">
import type { Product } from './types'
import Card from '@/components/Card.vue'

interface Props {
  items: Product[]
}
defineProps<Props>()

const emit = defineEmits(['addToFavorite'])

const onClickFavorite = (sneakerId: number) => emit('addToFavorite', sneakerId)

const onClickAdd = () => {}
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <Card
      v-for="item in items"
      :id="item.id"
      :key="item.id"
      :isFavorite="item.isFavorite"
      :isAdded="true"
      :price="item.price"
      :title="item.title"
      :imageUrl="item.imageUrl"
      :on-click-add="onClickAdd"
      :on-click-favorite="onClickFavorite"
    />
  </div>
</template>

<style scoped></style>
