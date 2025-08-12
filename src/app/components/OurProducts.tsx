"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { medusa } from "@/lib/medusa"
import { useCart } from "@/context/CartContext"

const REGION_ID = "reg_01K21EN3X2RN3R54Q2H7CFCNXR" // change if needed

type Prod = {
    id: string
    title: string
    thumbnail?: string | null
    images?: { url: string }[]
    variants?: any[]
}

export default function OurProducts() {
    const [products, setProducts] = useState<Prod[]>([])
    const [loading, setLoading] = useState(true)
    const [addingId, setAddingId] = useState<string | null>(null)
    const { addItem } = useCart()

    useEffect(() => {
        ; (async () => {
            setLoading(true)
            try {
                const { products } = await medusa.products.list({
                    limit: 8,
                    region_id: REGION_ID,
                })
                setProducts(products as Prod[])
            } catch (e) {
                console.error("Failed to load products:", e)
                setProducts([])
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const firstPrice = (p: Prod) => {
        const v = p.variants?.[0]
        // v2: calculated_price.calculated_amount is already in major units for INR (no /100)
        return (
            v?.calculated_price?.calculated_amount ??
            v?.prices?.[0]?.amount ??
            0
        )
    }

    const firstVariantId = (p: Prod) => p.variants?.[0]?.id as string | undefined

    const handleAdd = async (p: Prod) => {
        const variantId = firstVariantId(p)
        if (!variantId) return
        try {
            setAddingId(p.id)
            await addItem(variantId, 1)
        } finally {
            setAddingId(null)
        }
    }

    return (
        <section className="px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-center text-3xl md:text-4xl font-serif tracking-wide text-[#3c2f22]">
                    OUR PRODUCTS
                </h2>

                {loading ? (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-2xl bg-white shadow-sm p-4 h-80 animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <p className="text-center mt-6 text-sm text-gray-600">No products found.</p>
                ) : (
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((p) => {
                            const price = firstPrice(p)
                            const img = p.thumbnail || p.images?.[0]?.url || ""
                            return (
                                <div
                                    key={p.id}
                                    className="rounded-2xl bg-white shadow-md overflow-hidden"
                                >
                                    <Link href={`/products/${p.id}`} className="block">
                                        <div className="relative w-full h-56 bg-gray-50">
                                            {img ? (
                                                <Image
                                                    src={img}
                                                    alt={p.title}
                                                    fill
                                                    className="object-contain p-6"
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full" />
                                            )}
                                        </div>
                                    </Link>

                                    <div className="bg-[#fbf7f4] px-5 pt-4 pb-5">
                                        <div className="flex items-center justify-between text-[15px] mb-3">
                                            <span className="line-clamp-1">{p.title}</span>
                                            <span className="font-medium">Rs.{price}</span>
                                        </div>

                                        <button
                                            onClick={() => handleAdd(p)}
                                            disabled={addingId === p.id || !firstVariantId(p)}
                                            className="w-full bg-[#C5563A] hover:bg-[#a8452d] text-white font-semibold rounded-md py-3 disabled:opacity-60"
                                        >
                                            {addingId === p.id ? "ADDING..." : "ADD TO CART"}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
