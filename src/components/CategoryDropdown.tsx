"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { medusa } from "@/lib/medusa"

interface Category {
    id: string
    name: string
    handle: string
    metadata?: {
        image?: string
    }
}

interface CategoryDropdownProps {
    currentCategory?: string
    onCategoryChange?: (categoryId: string, categoryHandle: string) => void
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
    currentCategory,
    onCategoryChange
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { product_categories } = await medusa.productCategories.list({
                    limit: 20,
                })
                const parentCategories = product_categories?.filter(
                    (cat: any) => !cat.parent_category_id
                ) || []
                setCategories(parentCategories)
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleCategorySelect = (category: Category) => {
        if (onCategoryChange) {
            onCategoryChange(category.id, category.handle)
        } else {
            router.push(`/category/${category.handle}/${category.id}`)
        }
        setIsOpen(false)
    }

    const currentCategoryName = categories.find(cat => cat.id === currentCategory)?.name || (categories.length > 0 ? categories[0].name : 'Select Category')

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full md:w-80 px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C75545] focus:border-[#C75545] min-h-[48px] touch-manipulation"
            >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                    </svg>
                    <span className="text-gray-700 font-medium truncate text-left">
                        {loading ? 'Loading...' : currentCategoryName}
                    </span>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full md:w-80 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto">
                    {loading ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C75545] mx-auto mb-3"></div>
                            <p className="text-sm font-medium">Loading categories...</p>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p className="text-sm font-medium">No categories found</p>
                        </div>
                    ) : (
                        categories.map((category, index) => (
                            <button
                                key={category.id}
                                onClick={() => handleCategorySelect(category)}
                                className={`w-full px-4 py-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150 min-h-[56px] touch-manipulation ${index === 0 ? 'rounded-t-xl' : ''
                                    } ${index === categories.length - 1 ? 'rounded-b-xl' : ''
                                    } border-b border-gray-100 last:border-b-0`}
                            >
                                <div className="flex items-center space-x-3">
                                    {category.metadata?.image ? (
                                        <img
                                            src={category.metadata.image}
                                            alt={category.name}
                                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C75545] to-[#D17B6F] flex items-center justify-center flex-shrink-0">
                                            <span className="text-white text-sm font-bold">
                                                {category.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <span className="text-gray-700 font-medium truncate block">
                                            {category.name}
                                        </span>
                                        <span className="text-gray-400 text-sm truncate block">
                                            {category.handle}
                                        </span>
                                    </div>
                                    {currentCategory === category.id && (
                                        <div className="w-6 h-6 rounded-full bg-[#C75545] flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default CategoryDropdown
