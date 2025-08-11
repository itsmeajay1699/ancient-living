// src/components/TopSellersSection.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { medusa } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"
import ProductCard from "./ProductCard"

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
                region_id: "reg_01K21EN3X2RN3R54Q2H7CFCNXR",
                limit: 4
            })
            return productsRes.products
        },
    })

    return (
        <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Top Sellers</h2>
            {isLoading ? (
                <p>Loading products...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data?.map((product: any) => {
                        const thumbnail = product.thumbnail || product.images[0]?.url
                        const price = product.variants[0]?.calculated_price?.calculated_amount ?? 0

                        return (
                            <ProductCard
                                key={product.id}
                                product={{
                                    id: product.id,
                                    title: product.title,
                                    thumbnail,
                                    price
                                }}
                            />
                        )
                    })}
                </div>
            )}
        </section>
    )
}
