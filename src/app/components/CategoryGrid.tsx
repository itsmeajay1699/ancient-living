"use client"

import { useQuery } from "@tanstack/react-query"
import { medusa } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"

export default function CategoryGrid() {
    const { data, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: () => medusa.productCategories.list({
            limit: 4,
        }),
    })

    const parentCategories = data?.product_categories?.filter(
        (cat: any) => !cat.parent_category_id
    )

    return (
        <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
            {isLoading ? (
                <p>Loading categories...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {parentCategories?.map((cat: any) => {
                        const imageUrl = cat.metadata?.image

                        return (
                            <Link
                                href={`/collections/${cat.handle}`}
                                key={cat.id}
                                className="rounded-lg shadow-sm overflow-hidden group"
                            >
                                {imageUrl && (
                                    <div className="relative w-full md:h-[240px] h-[160px]">
                                        <Image
                                            src={imageUrl}
                                            alt={cat.name}
                                            fill
                                            className="object-fills transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <div className="p-4 text-center">
                                    <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
