"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { medusa } from "@/lib/medusa"
import { useCart } from "@/context/CartContext"

export default function ProductPage() {
    const { handle } = useParams()
    const router = useRouter()
    const { addItem } = useCart()

    const [product, setProduct] = useState<any>(null)
    const [selectedVariant, setSelectedVariant] = useState<any>(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true)
            setError(null)
            try {
                const idOrHandle = String(handle)
                let prod: any | null = null

                try {
                    const { product } = await medusa.products.retrieve(idOrHandle, {
                        region_id: "reg_01K21EN3X2RN3R54Q2H7CFCNXR",
                        country_code: "in"
                    })
                    prod = product
                } catch {
                    // Fallback by handle
                    const { products } = await medusa.products.list({ handle: idOrHandle, limit: 1 })
                    prod = products?.[0] ?? null
                }

                if (!prod) {
                    setError("Product not found.")
                    setProduct(null)
                    setSelectedVariant(null)
                } else {
                    setProduct(prod)
                    setSelectedVariant(prod.variants?.[0] ?? null)
                }
            } catch (e: any) {
                setError(e?.message || "Failed to load product.")
                setProduct(null)
                setSelectedVariant(null)
            } finally {
                setLoading(false)
            }
        }

        if (handle) fetchProduct()
    }, [handle])

    const priceInfo = useMemo(() => {
        const amount = selectedVariant?.prices?.[0]?.amount ?? 100
        const currency = (selectedVariant?.prices?.[0]?.currency_code ?? "inr").toUpperCase()
        return { amount, currency, display: `${(amount).toFixed(2)}` }
    }, [selectedVariant])

    const inStock = useMemo(() => {
        // If you use Medusa inventory service, adjust this check accordingly
        const q = selectedVariant?.inventory_quantity
        return typeof q === "number" ? q > 0 : true
    }, [selectedVariant])

    const onAddToCart = async () => {
        if (!selectedVariant?.id || !inStock) return
        try {
            setAdding(true)
            await addItem(selectedVariant.id, Math.max(1, quantity))
        } finally {
            setAdding(false)
        }
    }

    const onBuyNow = async () => {
        await onAddToCart()
        router.push("/checkout")
    }

    if (loading) return <p className="p-4">Loading...</p>
    if (error) return <p className="p-4 text-red-600">{error}</p>
    if (!product) return <p className="p-4">Not found</p>


    console.log(product.variants, "hello world");

    return (
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div>
                {product.thumbnail ? (
                    <img
                        src={product.thumbnail}
                        alt={product.title}
                        width={500}
                        height={500}
                        className="rounded shadow"
                    />
                ) : (
                    <div className="w-full aspect-square bg-gray-100 rounded" />
                )}
            </div>

            {/* Info */}
            <div>
                <h1 className="text-2xl font-bold mb-2">{product.title}</h1>

                {/* Variant selector (shown only if multiple variants) */}
                {product.variants?.length > 1 && (
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Variant</label>
                        <select
                            value={selectedVariant?.id || ""}
                            onChange={(e) => {
                                const v = product.variants.find((x: any) => x.id === e.target.value) || null
                                setSelectedVariant(v)
                            }}
                            className="border rounded px-3 py-2"
                        >
                            {product.variants.map((v: any) => (
                                <option key={v.id} value={v.id}>
                                    {v.title || v.id}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <p className="text-xl font-semibold text-green-700 mb-4">
                    {priceInfo.currency} {priceInfo.display}
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center mb-4">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="border px-3">
                        −
                    </button>
                    <input
                        type="number"
                        className="w-14 text-center border-y"
                        value={quantity}
                        onChange={(e) => {
                            const n = Number(e.target.value)
                            setQuantity(Number.isFinite(n) ? Math.max(1, n) : 1)
                        }}
                    />
                    <button onClick={() => setQuantity((q) => q + 1)} className="border px-3">
                        +
                    </button>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={onAddToCart}
                        disabled={!inStock || adding || !selectedVariant?.id}
                        className="bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-60"
                    >
                        {adding ? "Adding…" : inStock ? "Add to cart" : "Out of stock"}
                    </button>
                    <button
                        onClick={onBuyNow}
                        disabled={!inStock || adding || !selectedVariant?.id}
                        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
                    >
                        Buy it now
                    </button>
                </div>

                {/* Collapsibles */}
                <details className="mb-2">
                    <summary className="font-medium cursor-pointer">Description</summary>
                    <p className="text-sm mt-2">{product.description}</p>
                </details>

                {product.metadata?.ingredients && (
                    <details className="mb-2">
                        <summary className="font-medium cursor-pointer">Ingredients</summary>
                        <p className="text-sm mt-2">{product.metadata.ingredients}</p>
                    </details>
                )}

                {product.metadata?.benefits && (
                    <details className="mb-2">
                        <summary className="font-medium cursor-pointer">Benefits</summary>
                        <p className="text-sm mt-2">{product.metadata.benefits}</p>
                    </details>
                )}

                {product.metadata?.how_to_apply && (
                    <details className="mb-2">
                        <summary className="font-medium cursor-pointer">How To Apply</summary>
                        <p className="text-sm mt-2">{product.metadata.how_to_apply}</p>
                    </details>
                )}
            </div>
        </div>
    )
}
