"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { useMemo } from "react"
import { fixMedusaUrl } from "@/lib/utils"

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

    if (loading) {
        return <div className="flex justify-center items-center h-96"><p>Loading your cart...</p></div>
    }

    return (
        <div className="bg-stone-50 font-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif text-gray-800">Shopping Cart</h1>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-[#C75545] to-[#D17B6F] mx-auto mt-6"></div>
                </div>

                {!hasItems ? (
                    <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
                        <h2 className="text-2xl font-medium text-gray-800 mb-4">Your cart is empty.</h2>
                        <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet.</p>
                        <Link href="/" className="bg-[#C75545] text-white px-8 py-3 rounded-md hover:bg-[#b34a3a] transition-colors duration-300">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:items-start">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 space-y-4">
                            {cart!.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 border-b border-gray-200 pb-4 last:border-b-0">
                                    <div className="w-20 h-20 relative flex-shrink-0">
                                        {item.thumbnail ? (
                                            <img
                                                src={fixMedusaUrl(item.thumbnail)}
                                                alt={item.title}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 rounded-md" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-md font-medium text-gray-800 truncate">{item.title}</h3>
                                        {item.variant?.title && (
                                            <p className="text-sm text-gray-500 mt-1">{item.variant.title}</p>
                                        )}
                                        <p className="text-md font-semibold text-[#C75545] mt-1">
                                            {currency} {money(item.unit_price)}
                                        </p>
                                    </div>

                                    <div className="flex items-center border border-gray-300 rounded-md">
                                        <button
                                            onClick={() => updateItem(item.id, Math.max(1, (item.quantity || 1) - 1))}
                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md"
                                            aria-label="Decrease quantity"
                                        >
                                            −
                                        </button>
                                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateItem(item.id, (item.quantity || 0) + 1)}
                                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md"
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-sm text-gray-500 hover:text-red-600"
                                        aria-label="Remove item"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <h2 className="text-2xl font-medium text-gray-800 border-b pb-4 mb-4">Order Summary</h2>
                                <div className="space-y-3 text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({itemCount} items)</span>
                                        <span>{currency} {money(cart?.subtotal)}</span>
                                    </div>
                                    {cart?.shipping_total > 0 && (
                                        <div className="flex justify-between">
                                            <span>Shipping</span>
                                            <span>{currency} {money(cart.shipping_total)}</span>
                                        </div>
                                    )}
                                    {cart?.tax_total > 0 && (
                                        <div className="flex justify-between">
                                            <span>Tax</span>
                                            <span>{currency} {money(cart.tax_total)}</span>
                                        </div>
                                    )}
                                    <div className="border-t pt-4 mt-4 flex justify-between font-semibold text-lg text-gray-800">
                                        <span>Total</span>
                                        <span>{currency} {money(cart?.total)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push("/checkout")}
                                    disabled={!hasItems}
                                    className="w-full mt-6 bg-[#C75545] text-white py-3 rounded-md hover:bg-[#b34a3a] transition-colors duration-300 disabled:opacity-60"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
