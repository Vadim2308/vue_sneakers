<script setup lang="ts">
import CartItem from './CartItem.vue'
import { inject } from 'vue'
import type { CartContext } from '@/components/types'

const { cart, removeFromCart } = inject<CartContext>('cart')!
</script>

<template>
  <div v-auto-animate class="flex flex-1 flex-col gap-4">
    <CartItem
      :key="item.id"
      v-for="item in cart"
      :title="item.title"
      :image-url="item.imageUrl"
      :price="item.price"
      @on-click-remove="() => removeFromCart(item)"
    />
  </div>
</template>
