"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { medusa } from "@/lib/medusa";

interface Category {
    id: string;
    name: string;
    handle: string;
    metadata?: {
        image?: string;
    };
}

const CategoryStrip = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { product_categories } = await medusa.productCategories.list({
                    limit: 10,
                });
                const parentCategories =
                    product_categories?.filter((cat: any) => !cat.parent_category_id) || [];
                setCategories(parentCategories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryClick = (category: Category) => {
        router.push(`/category/${category.handle}/${category.id}`);
    };

    return (
        <div className="bg-white py-3 border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex overflow-x-auto space-x-6 md:space-x-8 justify-start md:justify-center items-center scrollbar-hide">
                    {loading ? (
                        <div className="flex space-x-8 animate-pulse">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : categories.length === 0 ? (
                        <p className="text-gray-500 text-center w-full">
                            No categories found
                        </p>
                    ) : (
                        categories.map((category) => (
                            <div
                                key={category.id}
                                className="flex-shrink-0 flex items-center space-x-3 cursor-pointer group"
                                onClick={() => handleCategoryClick(category)}
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden transform transition-transform duration-300 group-hover:scale-110">
                                    {category.metadata?.image ? (
                                        <img
                                            src={category.metadata.image}
                                            alt={category.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-500 text-lg font-semibold">
                                            {category.name.charAt(0)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-800 font-medium text-sm whitespace-nowrap group-hover:text-red-700 transition-colors duration-300">
                                    {category.name}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryStrip;
