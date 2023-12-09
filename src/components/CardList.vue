<script setup lang="ts">
import Card from './Card.vue'

const onClickAdd = () => {
  alert('onClickAdd')
}
const onClickFavorite = () => {
  alert('onClickFavorite')
}
</script>

<template>
  <div class="grid grid-cols-4 gap-5">
    <Card
      :isFavorite="true"
      :isAdded="true"
      :price="5000"
      title="Nike"
      imageUrl="/sneakers/sneakers-1.jpg"
      :on-click-add="onClickAdd"
      :on-click-favorite="onClickFavorite"
    />
    <Card :price="5000" title="Nike" imageUrl="/sneakers/sneakers-2.jpg" />
    <Card :price="5000" title="Nike" imageUrl="/sneakers/sneakers-3.jpg" />
    <Card :price="5000" title="Nike" imageUrl="/sneakers/sneakers-4.jpg" />
    <Card :price="5000" title="Nike" imageUrl="/sneakers/sneakers-5.jpg" />
    <Card :price="5000" title="Nike" imageUrl="/sneakers/sneakers-6.jpg" />
  </div>
</template>

<style scoped></style>
