"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Search, User, ShoppingCart } from "lucide-react"
import { medusa } from "@/lib/medusa"

type Cat = { id: string; handle?: string; name?: string; parent_category_id?: string | null }

export default function Footer() {
    const [cats, setCats] = useState<Cat[]>([])
    const [loadingCats, setLoadingCats] = useState(true)

    useEffect(() => {
        ; (async () => {
            try {
                // grab top-level categories and limit to 4
                const { product_categories } = await medusa.productCategories.list({
                    limit: 12, // fetch a few, then filter top-level below
                })
                const topLevel = (product_categories || []).filter(
                    (c: any) => !c.parent_category_id
                ) as Cat[]

                setCats(topLevel.slice(0, 4))
            } catch (e) {
                console.warn("Footer categories load failed:", e)
                setCats([])
            } finally {
                setLoadingCats(false)
            }
        })()
    }, [])

    const linkTo = (c: Cat) => `/collections/${c.handle || c.id}`

    return (
        <footer className="bg-[#F8F3EE] text-[#4b3a2b] mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Top grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
                    {/* Brand + tagline */}
                    <div>
                        <Link href="/" className="flex items-center">
                            <img
                                className="h-[57px] w-[171px] object-contain"
                                src="https://botanicalbloom.in/images/logo.png" alt="" />
                        </Link>

                        <div className="mt-3 text-[15px] leading-6 max-w-xs">
                            Where India’s timeless beauty meets
                            <br /> modern luxury.
                        </div>
                    </div>

                    {/* Categories (dynamic) */}
                    <div>
                        <h3 className="font-serif text-xl mb-3">Categories</h3>
                        <ul className="space-y-2 text-[15px]">
                            {loadingCats && <li className="opacity-60">Loading…</li>}
                            {!loadingCats && cats.length === 0 && (
                                <li className="opacity-60">No categories</li>
                            )}
                            {cats.map((c) => (
                                <li key={c.id}>
                                    <Link
                                        href={linkTo(c)}
                                        className="hover:underline underline-offset-2"
                                    >
                                        {c.name || c.handle || "Category"}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Have a question */}
                    <div>
                        <h3 className="font-serif text-xl mb-3">Have a question?</h3>
                        <div className="space-y-2 text-[15px]">
                            <a href="tel:+919599840666" className="hover:underline">
                                +91 9599840666
                            </a>
                            <div>
                                <a
                                    href="mailto:shivampundir@botanicalbloom.in"
                                    className="hover:underline break-all"
                                >
                                    shivampundir@botanicalbloom.in
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Get in touch */}
                    <div>
                        <h3 className="font-serif text-xl mb-3">Get in Touch</h3>
                        <div className="flex items-center gap-5">
                            <Link href="/search" aria-label="Search" className="hover:opacity-80">
                                <Search className="w-5 h-5" />
                            </Link>
                            <Link href="/login" aria-label="Account" className="hover:opacity-80">
                                <User className="w-5 h-5" />
                            </Link>
                            <Link href="/cart" aria-label="Cart" className="hover:opacity-80 relative">
                                <ShoppingCart className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="mt-10 pt-6 border-t border-[#e9e2d9]">
                    <div className="flex flex-col sm:flex-row items-center gap-3 justify-between text-[13px]">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <Link href="/policies/refund" className="hover:underline">Refund policy</Link>
                            <Link href="/policies/shipping" className="hover:underline">Shipping</Link>
                            <Link href="/policies/privacy" className="hover:underline">Privacy policy</Link>
                            <Link href="/policies/terms" className="hover:underline">Terms of service</Link>
                            <Link href="/contact" className="hover:underline">Contact</Link>
                        </div>
                        <div className="opacity-70">
                            © {new Date().getFullYear()} Ancient Living. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
