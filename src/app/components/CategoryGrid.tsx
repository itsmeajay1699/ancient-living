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
    });

    const parentCategories = data?.product_categories?.filter(
        (cat: any) => !cat.parent_category_id
    );

    if (!isLoading && (!parentCategories || parentCategories.length === 0)) {
        return null
    }

    return (
        <section id="categories" className="py-24 px-6 bg-stone-50">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-light text-gray-800 tracking-wide">
                    Shop by <span className="font-serif font-medium text-[#C75545]">Category</span>
                </h2>
                <div className="w-20 h-0.5 bg-gradient-to-r from-[#C75545] to-[#D17B6F] mx-auto mt-6 mb-4"></div>
            </div>

            {isLoading ? (
                <p className="text-center">Loading Categories...</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {parentCategories?.map((cat: any) => {
                        const imageUrl = cat.metadata?.image;

                        return (
                            <div key={cat.id} className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden group transition-shadow duration-300 hover:shadow-xl">
                                <Link href={`/category/${cat.handle}/${cat.id}`} className="block">
                                    <div className="relative w-full h-64 md:h-72 overflow-hidden">
                                        {imageUrl && (
                                            <Image
                                                src={imageUrl}
                                                alt={cat.name}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        )}
                                    </div>
                                </Link>
                                <div className="p-4 text-center flex-grow flex flex-col">
                                    <h3 className="text-lg font-medium text-gray-800">{cat.name}</h3>
                                    <div className="flex-grow"></div>
                                    <Link href={`/category/${cat.handle}/${cat.id}`} className="mt-4 inline-block bg-[#C75545] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#b34a3a] transition-colors duration-300">
                                        Shop Now
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
