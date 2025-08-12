"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { medusa } from "@/lib/medusa"
import ProductCard from "@/app/components/ProductCard"
import { DEFAULT_REGION_ID } from "@/config/constants"
import { fixMedusaUrl } from "@/lib/utils"

// set your region once
// const REGION_ID = "reg_01K21EN3X2RN3R54Q2H7CFCNXR" // Old local constant
const REGION_ID = DEFAULT_REGION_ID // Use centralized region configuration

export default function CategoryPage() {
    const { handle } = useParams()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [sort, setSort] = useState("featured")

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                // 3) fetch products in those categories (region for pricing)
                const { products } = await medusa.products.list({
                    category_id: handle,
                    region_id: REGION_ID,
                    limit: 60,
                })
                setProducts(products)
            } catch (e) {
                console.error("Category fetch error:", e)
                setProducts([])
            } finally {
                setLoading(false)
            }
        }

        if (handle) load()
    }, [handle])

    // Helper: get lowest calculated price for a product (NO divide by 100)
    const getPrice = (p: any): number => {
        const amounts =
            p?.variants?.map(
                (v: any) =>
                    v?.calculated_price?.calculated_amount ??
                    v?.prices?.[0]?.amount ??
                    0
            ) || []
        return amounts.length ? Math.min(...amounts) : 0
    }

    const sorted = useMemo(() => {
        const arr = [...products]
        if (sort === "price-low") {
            arr.sort((a, b) => getPrice(a) - getPrice(b))
        } else if (sort === "price-high") {
            arr.sort((a, b) => getPrice(b) - getPrice(a))
        }
        return arr
    }, [products, sort])

    const title =
        typeof handle === "string"
            ? handle.replace(/-/g, " ")
            : Array.isArray(handle)
                ? handle.join(" ").replace(/-/g, " ")
                : ""

    return (
        <div className="px-4 py-8 max-w-screen-xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 capitalize">{title}</h1>

            <div className="mb-6 text-gray-600 text-sm max-w-2xl">
                Showing {sorted.length} products
            </div>

            {/* Controls */}
            {/* <div className="flex justify-between items-center mb-6">
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border px-2 py-1 text-sm"
                >
                    <option value="featured">Sort by: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                </select>
            </div> */}

            {/* Grid */}
            {loading ? (
                <p>Loading...</p>
            ) : sorted.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sorted.map((p) => (
                        <ProductCard
                            key={p.id}
                            product={{
                                id: p.id,
                                title: p.title,
                                thumbnail: fixMedusaUrl(p.thumbnail || p.images?.[0]?.url),
                                price: getPrice(p),
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
