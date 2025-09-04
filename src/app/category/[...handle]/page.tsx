"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { medusa } from "@/lib/medusa"
import ProductCard from "@/app/components/ProductCard"
import CategoryDropdown from "@/components/CategoryDropdown"
import { DEFAULT_REGION_ID } from "@/config/constants"

// set your region once
// const REGION_ID = "reg_01K21EN3X2RN3R54Q2H7CFCNXR" // Old local constant
const REGION_ID = DEFAULT_REGION_ID // Use centralized region configuration

export default function CategoryPage() {
    const { handle } = useParams()
    const router = useRouter()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [sort, setSort] = useState("featured")
    const [currentCategoryId, setCurrentCategoryId] = useState<string>("")
    const [currentCategoryHandle, setCurrentCategoryHandle] = useState<string>("")

    useEffect(() => {
        if (handle && Array.isArray(handle)) {
            setCurrentCategoryId(handle[1] || "")
            setCurrentCategoryHandle(handle[0] || "")
        }
    }, [handle])

    const loadProducts = async (categoryId?: string) => {
        setLoading(true)
        try {
            const { products } = await medusa.products.list({
                category_id: categoryId || (Array.isArray(handle) ? handle[1] : undefined),
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

    useEffect(() => {
        if (handle) loadProducts()
    }, [handle])

    const handleCategoryChange = (categoryId: string, categoryHandle: string) => {
        if (categoryId && categoryHandle) {
            setCurrentCategoryId(categoryId)
            setCurrentCategoryHandle(categoryHandle)
            router.push(`/category/${categoryHandle}/${categoryId}`)
        }
        // Removed the else clause that handled "All Categories"
    }

    // Helper: get lowest calculated price for a product (NO divide by 100)
    const getPrice = (p: any): number => {
        const amounts =
            p?.variants?.map((v: any) => v?.calculated_price?.original_amount) || []
        console.log(amounts)
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

    const title = currentCategoryHandle ? currentCategoryHandle.replace(/-/g, " ") : (handle && handle[0] ? handle[0].replace(/-/g, " ") : "Select Category")

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-screen-xl mx-auto">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 capitalize break-words">
                                {title || "All Categories"}
                            </h1>
                            <div className="text-gray-600 text-sm sm:text-base">
                                Showing {sorted.length} products
                            </div>
                        </div>

                        {/* Controls Section */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center w-full lg:w-auto">
                            <div className="flex-1 sm:flex-initial">
                                <CategoryDropdown
                                    currentCategory={currentCategoryId}
                                    onCategoryChange={handleCategoryChange}
                                />
                            </div>

                            {/* Sort Dropdown */}
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C75545] focus:border-[#C75545] text-gray-700 font-medium min-h-[48px] touch-manipulation w-full sm:w-auto"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4 sm:mb-0">
                        <button
                            onClick={() => router.push('/')}
                            className="hover:text-[#C75545] transition-colors touch-manipulation p-1"
                        >
                            Home
                        </button>
                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-900 font-medium capitalize truncate">
                            {title || "Categories"}
                        </span>
                    </nav>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-16 sm:py-20">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#C75545] mx-auto mb-4"></div>
                            <p className="text-gray-600 text-sm sm:text-base">Loading products...</p>
                        </div>
                    </div>
                ) : sorted.length === 0 ? (
                    <div className="text-center py-16 sm:py-20 px-4">
                        <div className="max-w-md mx-auto">
                            <svg className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-600 mb-6 text-sm sm:text-base">Try selecting a different category or browse all products</p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => router.push('/')}
                                    className="bg-[#C75545] text-white px-6 py-3 rounded-lg hover:bg-[#b34a3a] transition-colors duration-200 font-medium touch-manipulation"
                                >
                                    Browse All Products
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                        {sorted.map((p) => (
                            <ProductCard
                                key={p.id}
                                product={{
                                    id: p.id,
                                    title: p.title,
                                    thumbnail: p.thumbnail || p.images?.[0]?.url,
                                    price: getPrice(p),
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
