// src/components/TopSellersSection.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { medusa } from "@/lib/medusa"
import ProductCard from "./ProductCard"
import { DEFAULT_REGION_ID } from "@/config/constants"

export default function TopSellersSection() {

    const { data, isLoading } = useQuery({
        queryKey: ["top-sellers"],
        queryFn: async () => {
            const collectionsRes = await medusa.collections.list()
            const topSellers = collectionsRes.collections.find(
                (c: any) => c.title.toLowerCase() === "top sellers"
            )

            if (!topSellers) throw new Error("Top Sellers collection not found")

            const productsRes = await medusa.products.list({
                collection_id: [topSellers.id],
                region_id: DEFAULT_REGION_ID,
                limit: 4
            })
            return productsRes.products
        },
    })

    return (
        <section id="top-sellers" className="py-24 px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-light text-gray-800 tracking-wide">
                    Our <span className="font-medium text-[#C75545]">Top Sellers</span>
                </h2>
                <div className="w-20 h-0.5 bg-gradient-to-r from-[#C75545] to-[#D17B6F] mx-auto mt-6"></div>
            </div>
            {isLoading ? (
                <p className="text-center">Loading top sellers...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data?.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </section>
    )
}
