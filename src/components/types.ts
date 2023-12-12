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
