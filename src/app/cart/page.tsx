"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { useMemo } from "react"

export default function CartPage() {
    const router = useRouter()
    const { cart, loading, updateItem, removeItem } = useCart()

    const hasItems = (cart?.items?.length || 0) > 0
    const currency = (cart?.region?.currency_code || "inr").toUpperCase()
    const money = (n?: number) => (typeof n === "number" ? (n).toFixed(2) : "0.00")

    const itemCount = useMemo(
        () => cart?.items?.reduce((s, i) => s + (i.quantity || 0), 0) ?? 0,
        [cart?.items]
    )

    if (loading) return <div className="max-w-5xl mx-auto p-4">Loading cart…</div>

    return (
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2">
                <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

                {!hasItems ? (
                    <div className="border rounded-lg p-6 bg-white">
                        <p className="mb-3">Your cart is empty.</p>
                        <Link href="/" className="text-green-700 hover:underline">Continue shopping →</Link>
                    </div>
                ) : (
                    <ul className="divide-y border rounded-lg bg-white">
                        {cart!.items.map((item) => (
                            <li key={item.id} className="p-4 flex items-center gap-4">
                                {item.thumbnail ? (
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        width={72}
                                        height={72}
                                        className="rounded"
                                    />
                                ) : (
                                    <div className="w-18 h-18 bg-gray-100 rounded" />
                                )}

                                <div className="flex-1">
                                    <div className="font-medium">{item.title}</div>
                                    {item.variant_title && (
                                        <div className="text-xs text-gray-500">{item.variant_title}</div>
                                    )}
                                    <div className="text-sm text-gray-600 mt-1">
                                        {currency} {(item.unit_price).toFixed(2)}
                                    </div>
                                </div>

                                {/* Qty controls */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateItem(item.id, Math.max(1, (item.quantity || 1) - 1))}
                                        className="px-2 py-1 border rounded"
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateItem(item.id, (item.quantity || 0) + 1)}
                                        className="px-2 py-1 border rounded"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="ml-4 text-sm text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
                <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Items</span>
                        <span>{itemCount}</span>
                    </div>

                    <div className="flex justify-between text-sm mb-1">
                        <span>Subtotal</span>
                        <span>
                            {currency} {money(cart?.subtotal)}
                        </span>
                    </div>

                    {cart?.shipping_total ? (
                        <div className="flex justify-between text-sm mb-1">
                            <span>Shipping</span>
                            <span>
                                {currency} {money(cart.shipping_total)}
                            </span>
                        </div>
                    ) : null}

                    {cart?.tax_total ? (
                        <div className="flex justify-between text-sm mb-1">
                            <span>Tax</span>
                            <span>
                                {currency} {money(cart.tax_total)}
                            </span>
                        </div>
                    ) : null}

                    <div className="flex justify-between font-semibold text-lg mt-2">
                        <span>Total</span>
                        <span>
                            {currency} {money(cart?.total ?? cart?.subtotal)}
                        </span>
                    </div>

                    <button
                        onClick={() => router.push("/checkout")}
                        disabled={!hasItems}
                        className="w-full mt-4 bg-green-600 text-white rounded px-4 py-2 disabled:opacity-60"
                    >
                        Purchase
                    </button>

                    <p className="text-xs text-gray-500 mt-2">
                        Prices in {currency}. You can adjust quantities above.
                    </p>
                </div>
            </div>
        </div>
    )
}
