"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { medusa } from "@/lib/medusa"
import { sdk } from "@/lib/medusa"
import { DEFAULT_REGION_ID } from "@/config/constants"

type CartItem = { id: string; title: string; quantity: number; unit_price: number; variant?: { id: string }; thumbnail?: string | null }
type Cart = { id: string; items: CartItem[]; subtotal?: number; total?: number; region?: { currency_code: string } }

type Ctx = {
    cart: Cart | null
    cartId: string | null
    loading: boolean
    ensureCart: () => Promise<string>
    addItem: (variant_id: string, quantity?: number, metadata?: Record<string, any>) => Promise<void>
    updateItem: (line_id: string, quantity: number) => Promise<void>
    removeItem: (line_id: string) => Promise<void>
    refresh: () => Promise<void>
    clearCart: () => void
    associateWithCustomer: (email: string) => Promise<void>
    loadCustomerCart: (customerEmail: string) => Promise<void>
}

const CartContext = createContext<Ctx | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartId, setCartId] = useState<string | null>(null)
    const [cart, setCart] = useState<Cart | null>(null)
    const [loading, setLoading] = useState(true)

    const load = useCallback(async (id: string) => {
        const { cart } = await medusa.carts.retrieve(id)
        setCart(cart as Cart)
    }, [])

    const ensureCart = useCallback(async () => {
        let id = cartId || (typeof window !== "undefined" ? localStorage.getItem("cart_id") : null)
        if (!id) {
            const { cart } = await medusa.carts.create({
                region_id: DEFAULT_REGION_ID,
            })
            id = cart.id
            localStorage.setItem("cart_id", id!)
        }
        if (!id) {
            throw new Error("Failed to create or retrieve cart id")
        }
        if (id !== cartId) setCartId(id)
        await load(id)
        return id
    }, [cartId, load])

    useEffect(() => {
        ; (async () => {
            try {
                await ensureCart()
            } finally {
                setLoading(false)
            }
        })()
    }, [ensureCart])

    const refresh = useCallback(async () => {
        if (!cartId) return
        await load(cartId)
    }, [cartId, load])

    const clearCart = useCallback(() => {
        setCartId(null)
        setCart(null)
        localStorage.removeItem("cart_id")
        console.log("Cart cleared successfully")
    }, [])

    const addItem = useCallback(
        async (variant_id: string, quantity = 1, metadata?: Record<string, any>) => {
            const id = await ensureCart()
            await medusa.carts.lineItems.create(id!, { variant_id, quantity, })
            await refresh()
        },
        [ensureCart, refresh]
    )

    const updateItem = useCallback(
        async (line_id: string, quantity: number) => {
            if (!cartId) return
            await medusa.carts.lineItems.update(cartId, line_id, { quantity, })
            await refresh()
        },
        [cartId, refresh]
    )

    const removeItem = useCallback(
        async (line_id: string) => {
            if (!cartId) return
            await medusa.carts.lineItems.delete(cartId, line_id)
            await refresh()
        },
        [cartId, refresh]
    )

    const associateWithCustomer = useCallback(
        async (email: string) => {
            if (!cartId) return
            try {
                await medusa.carts.update(cartId, { email })
                await refresh()
                console.log("Cart associated with customer:", email)
            } catch (error) {
                console.error("Failed to associate cart with customer:", error)
            }
        },
        [cartId, refresh]
    )

    const loadCustomerCart = useCallback(
        async (customerEmail: string) => {
            try {
                console.log("Setting up customer cart for:", customerEmail)

                // Get the current cart ID if it exists
                const currentCartId = localStorage.getItem("cart_id")

                if (currentCartId) {
                    // If we have an existing cart, just associate it with the customer
                    try {
                        await medusa.carts.update(currentCartId, { email: customerEmail })
                        await load(currentCartId)
                        console.log("Associated existing cart with customer:", currentCartId)
                        return
                    } catch (error) {
                        console.error("Failed to associate existing cart:", error)
                    }
                }

                // If no existing cart or association failed, create a new one
                const { cart: newCart } = await medusa.carts.create({
                    // region_id: "reg_01K21EN3X2RN3R54Q2H7CFCNXR", // Old hardcoded region
                    region_id: DEFAULT_REGION_ID, // Centralized region configuration
                    email: customerEmail
                })

                if (newCart?.id) {
                    setCartId(newCart.id)
                    localStorage.setItem("cart_id", newCart.id)
                    setCart(newCart as Cart)
                    console.log("Created new customer cart:", newCart.id)
                } else {
                    throw new Error("Failed to create customer cart")
                }

            } catch (error) {
                console.error("Failed to load customer cart:", error)
                // Fallback: ensure we have a cart and associate it
                try {
                    const currentCartId = await ensureCart()
                    await associateWithCustomer(customerEmail)
                    console.log("Fallback: ensured cart and associated with customer")
                } catch (fallbackError) {
                    console.error("Fallback also failed:", fallbackError)
                }
            }
        },
        [ensureCart, associateWithCustomer, load]
    )

    const value = useMemo(
        () => ({ cart, cartId, loading, ensureCart, addItem, updateItem, removeItem, refresh, clearCart, associateWithCustomer, loadCustomerCart }),
        [cart, cartId, loading, ensureCart, addItem, updateItem, removeItem, refresh, clearCart, associateWithCustomer, loadCustomerCart]
    )

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error("useCart must be used within CartProvider")
    return ctx
}
