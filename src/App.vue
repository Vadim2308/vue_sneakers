<script setup lang="ts">
import { onMounted, provide, reactive, ref, watch } from 'vue'
import Header from './components/Header.vue'
import CardList from './components/CardList.vue'
import type { Favorite, Product } from '@/components/types'
import { $api } from '@/axios'

const items = ref<Product[]>([])

const filters = reactive<{ sortBy: string; searchQuery: string }>({
  sortBy: 'title',
  searchQuery: ''
})

const onChangeSelect = (e: any) => {
  filters.sortBy = e.target.value
}

const onChangeSearchInput = (e: any) => {
  filters.searchQuery = e.target.value
}

const deleteFromFavorite = async (id: number) => {
  try {
    const { data } = await $api.delete<Favorite>(`/favorites/${id}`)
  } catch (e) {}
}

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
  } catch (e) {}
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
watch(filters, fetchItems)

provide('addToFavorite', addToFavorite) // Аналог контекста
</script>

<template>
  <!--  <Drawer />-->
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <Header />
    <div class="p-10">
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
        <CardList @addToFavorite="addToFavorite" :items="items" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
