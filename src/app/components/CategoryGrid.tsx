"use client"

import { useQuery } from "@tanstack/react-query"
import { medusa } from "@/lib/medusa"
import Image from "next/image"
import Link from "next/link"
import { fixMedusaUrl } from "@/lib/utils"

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
        <section className="py-24 px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-light text-gray-800 tracking-wide">
                    Shop by <span className="font-serif font-medium text-[#C75545]">Category</span>
                </h2>
                <div className="w-20 h-0.5 bg-gradient-to-r from-[#C75545] to-[#D17B6F] mx-auto mt-6 mb-4"></div>
            </div>
            {isLoading ? (
                <p className="text-center">Loading Categories...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {parentCategories?.map((cat: any) => {
                        const imageUrl = fixMedusaUrl(cat.metadata?.image)

                        return (
                            <Link
                                href={`/category/${cat.handle}/${cat.id}`}
                                key={cat.id}
                                className="relative rounded-lg overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-300"
                            >
                                {imageUrl && (
                                    <div className="relative w-full h-64 md:h-80">
                                        <Image
                                            src={imageUrl}
                                            alt={cat.name}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 p-6">
                                    <h3 className="text-xl font-semibold text-white">{cat.name}</h3>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </section>
    )
}
