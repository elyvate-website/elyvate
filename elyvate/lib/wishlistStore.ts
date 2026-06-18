'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from './supabase'

export type WishlistItem = {
  id: string
  name: string
  price: number
  compare_price: number | null
  image: string
  slug: string
  stock_status: 'in_stock' | 'out_of_stock'
}

type WishlistStore = {
  items: WishlistItem[]
  toggleItem: (product: Product) => void
  removeItem: (id: string) => void
  isWishlisted: (id: string) => boolean
  clearWishlist: () => void
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (product) => {
        const exists = get().items.some(i => i.id === product.id)
        if (exists) {
          set(state => ({ items: state.items.filter(i => i.id !== product.id) }))
        } else {
          set(state => ({
            items: [...state.items, {
              id: product.id,
              name: product.name,
              price: product.price,
              compare_price: product.compare_price ?? null,
              image: product.images?.[0] ?? '',
              slug: product.slug,
              stock_status: product.stock_status,
            }],
          }))
        }
      },

      removeItem: (id) =>
        set(state => ({ items: state.items.filter(i => i.id !== id) })),

      isWishlisted: (id) => get().items.some(i => i.id === id),

      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'elyvate-wishlist' }
  )
)
