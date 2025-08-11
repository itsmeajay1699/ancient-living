import React from 'react'
import Link from 'next/link'

const ProductCard = ({ product }: any) => {
    const { id, title, thumbnail, price } = product

    return (
        <Link href={`/products/${id}`} className="border border-gray-200 rounded-lg p-4 shadow-sm">
            {thumbnail && (
                <img
                    src={thumbnail}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="w-full h-auto object-cover rounded"
                />
            )}
            <h3 className="font-semibold mt-3">{product.title}</h3>
            <p className="text-gray-700 mt-1 text-sm">₹{(price || 0) / 100}</p>
            <button className="mt-2 w-full bg-black text-white text-sm px-3 py-2 rounded-lg">
                Buy Now
            </button>
        </Link>
    )
}

export default ProductCard
