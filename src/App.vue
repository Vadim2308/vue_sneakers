<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import Header from './components/Header.vue'
import type { CartContext, Product } from '@/components/types'
import { $api } from '@/axios'
import Drawer from '@/components/Drawer.vue'

const cart = ref<Product[]>([])

const isCreatingOrder = ref(false)

const drawerOpen = ref<boolean>(false)

const totalPrice = computed(() => cart.value.reduce((acc, item) => acc + item.price, 0)) // Вычисляемое свойство, без него это будет просто переменная, которая не меняется от рендера
const vatPrice = computed(() => Math.round(totalPrice.value * 0.05))

const cartButtonDisabled = computed(() => isCreatingOrder.value || totalPrice.value === 0)

const addToCart = (item: Product) => {
  item.isAdded = true
  cart.value.push(item)
}

const removeFromCart = (item: Product) => {
  item.isAdded = false
  cart.value.splice(cart.value.indexOf(item), 1)
}

const closeDrawer = () => {
  drawerOpen.value = false
}

const openDrawer = () => {
  drawerOpen.value = true
}

const createOrder = async () => {
  try {
    isCreatingOrder.value = true
    const { data } = await $api.post('/orders', {
      items: cart.value,
      totalPrice: totalPrice.value
    })
    cart.value = []
    return data
  } catch (e) {
    console.error(e)
  } finally {
    isCreatingOrder.value = false
  }
}

watch(totalPrice, () => {
  if (totalPrice.value === 0) {
    closeDrawer()
  }
})

provide<CartContext>('cart', { closeDrawer, openDrawer, cart, addToCart, removeFromCart }) // Аналог контекста
</script>

<template>
  <Drawer
    v-if="drawerOpen"
    :total-price="totalPrice"
    :vat="vatPrice"
    @create-order="createOrder"
    :disabledButton="cartButtonDisabled"
  />
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <Header :total-price="totalPrice" @open-drawer="openDrawer" />
    <div class="p-10"><router-view></router-view></div>
  </div>
</template>

<style scoped></style>
