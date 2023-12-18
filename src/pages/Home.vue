<script setup lang="ts">
import { inject, onMounted, reactive, ref, watch } from 'vue'
import debounce from 'lodash.debounce'
import CardList from '../components/CardList.vue'
import { $api } from '@/axios'
import type { CartContext, Favorite, Product } from '../components/types'

const { cart, addToCart, removeFromCart } = inject<CartContext>('cart')!

const items = ref<Product[]>([])

const filters = reactive<{ sortBy: string; searchQuery: string }>({
  sortBy: 'title',
  searchQuery: ''
})

const onClickAddPlus = (item: Product) => {
  if (!item.isAdded) {
    addToCart(item)
  } else {
    removeFromCart(item)
  }
}

const onChangeSelect = (event: any) => {
  filters.sortBy = event.target.value
}

const onChangeSearchInput = debounce((event: any) => {
  filters.searchQuery = event.target.value
}, 300)

const addToFavorite = async (sneakerId: number) => {
  const item = items.value.find((sneaker) => sneaker.id === sneakerId)
  if (!item) return
  try {
    if (!item.isFavorite) {
      const payload = {
        parentId: item.id
      }
      const { data } = await $api.post<Favorite>('/favorites', payload)
      item.isFavorite = !item.isFavorite
      item.favoriteId = data.id
    } else {
      await $api.delete<Favorite>(`/favorites/${item.favoriteId}`)
      item.isFavorite = false
      delete item.favoriteId
    }
  } catch (e) {
    console.error(e)
  }
}

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await $api.get<Favorite[]>('/favorites')
    const mappedByParentId = favorites.reduce(
      (acc, item) => {
        acc[item.parentId] = item
        return acc
      },
      {} as Record<number, Favorite>
    )
    items.value = items.value.map((item) => {
      if (mappedByParentId[item.id]) {
        return { ...item, isFavorite: true, favoriteId: mappedByParentId[item.id].id }
      }
      return item
    })
  } catch (e) {
    console.error(e)
  }
}

const fetchItems = async () => {
  try {
    const { sortBy, searchQuery } = filters
    const { data } = await $api.get<Product[]>('/items', {
      params: {
        sortBy: sortBy ? `${sortBy}` : undefined,
        title: searchQuery ? `*${searchQuery}*` : undefined
      }
    })
    items.value = data.map((entity) => ({ ...entity, isAdded: false, isFavorite: false }))
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  await fetchItems()
  await fetchFavorites()
})
watch(cart, () => {
  items.value = items.value.map((el) => ({ ...el, isAdded: false }))
})
watch(filters, fetchItems) // Проверяет, изменилась ли ссылка в filters.value на что то другое. Если надо отследить внутренности, то есть {deep:true}
</script>

<template>
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>
    <div class="flex gap-4">
      <select @change="onChangeSelect" class="py-2 px-3 border rounded-md outline-none">
        <option value="name">По названию</option>
        <option value="price">По цене (дешевые)</option>
        <option value="-price">По цене (дорогие)</option>
      </select>
      <div class="relative">
        <img class="absolute left-4 top-3.5" src="/search.svg" alt="search" />
        <input
          @input="onChangeSearchInput"
          class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
          placeholder="Поиск..."
          type="text"
        />
      </div>
    </div>
  </div>
  <div class="mt-10">
    <CardList @add-to-favorite="addToFavorite" @add-to-cart="onClickAddPlus" :items="items" />
  </div>
</template>
