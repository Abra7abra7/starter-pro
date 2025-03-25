"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define the wine product type
export type WineProduct = {
  id: string
  name: string
  type: 'biele' | 'cervene' | 'ruzove' | 'sampanske'
  year: number
  price: number
  description: string
  image: string
}

// Define the cart item type (product + quantity)
export type CartItem = {
  product: WineProduct
  quantity: number
}

// Define the cart context type
type CartContextType = {
  items: CartItem[]
  addToCart: (product: WineProduct) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  isInCart: (productId: string) => boolean
}

// Create the cart context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Create the cart provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  
  // Load cart from localStorage on initial render (client-side only)
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    }
  }, [])
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }, [items])
  
  // Add a product to the cart
  const addToCart = (product: WineProduct) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id)
      
      if (existingItem) {
        // Increase quantity if product already in cart
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      } else {
        // Add new product to cart
        return [...prevItems, { product, quantity: 1 }]
      }
    })
  }
  
  // Remove a product from the cart
  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId))
  }
  
  // Update quantity of a product in the cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    )
  }
  
  // Clear the entire cart
  const clearCart = () => {
    setItems([])
  }
  
  // Calculate total price of all items in cart
  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }
  
  // Get total number of items in cart
  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }
  
  // Check if a product is in the cart
  const isInCart = (productId: string) => {
    return items.some(item => item.product.id === productId)
  }
  
  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Create a hook to use the cart context
export function useCart() {
  const context = useContext(CartContext)
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  
  return context
}
