"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { medusa } from "@/lib/medusa"
import { useCart } from "@/context/CartContext"
import { DEFAULT_REGION_ID, COUNTRY_CODE } from "@/config/constants"
import { fixMedusaUrl } from "@/lib/utils"

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
                        region_id: DEFAULT_REGION_ID,
                        country_code: COUNTRY_CODE
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
        if (!selectedVariant?.id || !inStock) return;
        await onAddToCart()
        router.push("/checkout")
    }

    if (loading) {
        return <div className="flex justify-center items-center h-96"><p>Loading product...</p></div>
    }
    if (error) {
        return <div className="flex justify-center items-center h-96"><p className="text-red-600">{error}</p></div>
    }
    if (!product) {
        return <div className="flex justify-center items-center h-96"><p>Product not found.</p></div>
    }

    // Helper to format metadata keys into titles (e.g., "how_to_apply" -> "How To Apply")
    const formatMetadataTitle = (key: string) => {
        return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };

    return (
        <div className="bg-stone-50 font-light">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Image Gallery */}
                    <div className="p-4 bg-white rounded-lg shadow-sm sticky top-24">
                        <div className="w-full aspect-square relative overflow-hidden rounded-lg">
                            {product.thumbnail ? (
                                <img
                                    src={fixMedusaUrl(product.thumbnail)}
                                    alt={product.title}
                                    className="w-full h-full object-cover object-center"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100" />
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <h1 className="text-4xl font-serif text-gray-800">{product.title}</h1>

                        <p className="text-3xl font-medium text-[#C75545]">
                            {priceInfo.currency} {priceInfo.display}
                        </p>

                        {product.variants?.length > 1 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Variant</label>
                                <select
                                    value={selectedVariant?.id || ""}
                                    onChange={(e) => {
                                        const v = product.variants.find((x: any) => x.id === e.target.value) || null
                                        setSelectedVariant(v)
                                    }}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#C75545] focus:border-[#C75545]"
                                >
                                    {product.variants.map((v: any) => (
                                        <option key={v.id} value={v.id}>
                                            {v.title || v.id}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-md">
                                    −
                                </button>
                                <input
                                    type="number"
                                    className="w-14 text-center border-x border-gray-300 focus:ring-0 focus:border-gray-300"
                                    value={quantity}
                                    onChange={(e) => {
                                        const n = Number(e.target.value)
                                        setQuantity(Number.isFinite(n) ? Math.max(1, n) : 1)
                                    }}
                                />
                                <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-md">
                                    +
                                </button>
                            </div>
                            <button
                                onClick={onAddToCart}
                                disabled={!inStock || adding || !selectedVariant?.id}
                                className="flex-1 bg-[#C75545] text-white px-6 py-2.5 rounded-md hover:bg-[#b34a3a] transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {adding ? "Adding…" : inStock ? "Add to Cart" : "Out of Stock"}
                            </button>
                        </div>

                        <button
                            onClick={onBuyNow}
                            disabled={!inStock || adding || !selectedVariant?.id}
                            className="w-full bg-gray-800 text-white px-6 py-2.5 rounded-md hover:bg-gray-700 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Buy It Now
                        </button>

                        {/* Description */}
                        <div className="pt-6">
                            <h2 className="text-xl font-medium text-gray-900 mb-2">Description</h2>
                            <p className="text-gray-600 leading-relaxed font-medium">{product.description}</p>
                        </div>

                        {/* Dynamic Metadata Accordion */}
                        <div className="pt-6 space-y-2">
                            {product.metadata && Object.keys(product.metadata).map((key) => (
                                <details key={key} className="group border-b border-gray-200">
                                    <summary className="flex justify-between items-center w-full py-4 font-medium text-left cursor-pointer list-none">
                                        <span>{formatMetadataTitle(key)}</span>
                                        <span className="text-gray-500 group-open:rotate-90 transition-transform duration-200">+</span>
                                    </summary>
                                    <div className="pb-4 text-gray-600">
                                        {String(product.metadata[key])}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
