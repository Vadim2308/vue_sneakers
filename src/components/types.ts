import type { Ref, UnwrapRef } from 'vue'

export type Product = {
  id: number
  title: string
  price: number
  imageUrl: string
  isFavorite: boolean
  isAdded: boolean
  favoriteId?: number
}

export type Favorite = {
  id: number
  parentId: number
}

export type CartContext = {
  closeDrawer: Function
  openDrawer: Function
  cart: Ref<UnwrapRef<Product[]>>
  addToCart: (product: Product) => void
  removeFromCart: (product: Product) => void
}
