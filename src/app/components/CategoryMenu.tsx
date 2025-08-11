"use client";
import { useQuery } from "@tanstack/react-query";
import { medusa } from "@/lib/medusa";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";

export default function CategoryMenu() {
    const { data, isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: () => medusa.productCategories.list(),
    });

    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleEnter = (id: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpenCategory(id);
    };

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setOpenCategory(null);
        }, 150); // buffer to avoid flicker
    };

    if (isLoading) return <div className="p-4">Loading categories...</div>;

    const parentCategories = data?.product_categories?.filter(
        (cat: any) => !cat.parent_category_id
    );

    return (
        <nav className="flex flex-col md:flex-row md:space-x-4 px-4 py-2 relative z-50">
            {parentCategories?.map((cat: any) => (
                <div
                    key={cat.id}
                    className="relative"
                    onMouseEnter={() => handleEnter(cat.id)}
                    onMouseLeave={handleLeave}
                >
                    {/* Whole Hover Area */}
                    <div className="flex items-center space-x-1 px-3 py-2 font-medium text-gray-800 hover:text-black cursor-pointer">
                        <span>{cat.name}</span>
                        {cat.category_children?.length > 0 && (
                            <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${openCategory === cat.id ? "rotate-180" : ""
                                    }`}
                            />
                        )}
                    </div>

                    {/* Dropdown */}
                    {cat.category_children?.length > 0 && openCategory === cat.id && (
                        <div className="absolute left-0 top-full bg-white border rounded mt-1 min-w-[180px]">
                            <ul className="p-2 space-y-1">
                                {cat.category_children.map((sub: any) => (
                                    <li key={sub.id}>
                                        <Link
                                            href={`/category/${sub.id}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            {sub.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
}
