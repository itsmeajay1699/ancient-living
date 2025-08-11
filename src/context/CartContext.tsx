"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { medusa } from "@/lib/medusa"

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
                region_id: "reg_01K21EN3X2RN3R54Q2H7CFCNXR",
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

    const value = useMemo(
        () => ({ cart, cartId, loading, ensureCart, addItem, updateItem, removeItem, refresh }),
        [cart, cartId, loading, ensureCart, addItem, updateItem, removeItem, refresh]
    )

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error("useCart must be used within CartProvider")
    return ctx
}
