"use client"
import { useEffect, useState } from "react"
import { medusa } from "@/lib/medusa"
import ProductCard from "@/app/components/ProductCard"


export default function CollectionPage({ params }: { params: { handle: string } }) {
    const [products, setProducts] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [inStockOnly, setInStockOnly] = useState(false)
    const [sort, setSort] = useState("featured")

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)

            try {
                const { product_categories } = await medusa.productCategories.list()
                const category = product_categories.find((c: any) => c.handle === params.handle)

                if (!category) {
                    setProducts([])
                    setFiltered([])
                    return
                }

                const categoryIds = [category.id]

                const collectChildIds = (cat: any) => {
                    if (cat.category_children) {
                        cat.category_children.forEach((child: any) => {
                            categoryIds.push(child.id)
                            collectChildIds(child)
                        })
                    }
                }

                collectChildIds(category)

                const { products } = await medusa.products.list({
                    category_id: categoryIds,
                    region_id: "reg_01K21EN3X2RN3R54Q2H7CFCNXR",
                })

                setProducts(products)
                setFiltered(products)
            } catch (error) {
                console.error(error)
                setProducts([])
                setFiltered([])
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [params.handle])


    useEffect(() => {
        let result = [...products]

        if (inStockOnly) {
            result = result.filter((p) =>
                p.variants.some((v: any) => v.inventory_quantity > 0)
            )
        }

        if (sort === "price-low") {
            result.sort((a, b) => a.variants[0].prices[0].amount - b.variants[0].prices[0].amount)
        } else if (sort === "price-high") {
            result.sort((a, b) => b.variants[0].prices[0].amount - a.variants[0].prices[0].amount)
        }

        setFiltered(result)
    }, [inStockOnly, sort, products])

    return (
        <div className="px-4 py-8 max-w-screen-xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 capitalize">{params.handle.replace("-", " ")}</h1>

            <div className="mb-6 text-gray-600 text-sm max-w-2xl">
                Showing {filtered.length} products
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center mb-6">
                {/* <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    In stock only
                </label> */}

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border px-2 py-1 text-sm"
                >
                    <option value="featured">Sort by: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                </select>
            </div>

            {/* Product Grid */}
            {loading ? (
                <p>Loading...</p>
            ) : filtered.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={{
                                id: product.id,
                                title: product.title,
                                thumbnail: product.thumbnail || product.images[0]?.url,
                                price: product.variants[0]?.calculated_price?.calculated_amount ?? 0
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
