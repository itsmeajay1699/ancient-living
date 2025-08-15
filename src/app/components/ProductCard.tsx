import React from 'react'
import Link from 'next/link'
import { fixMedusaUrl } from '@/lib/utils'

const ProductCard = ({ product }: any) => {
    // Default to an empty object to avoid errors if product is null/undefined
    const { id, title, thumbnail, price } = product || {};

    return (
        <div className="group relative flex flex-col overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300">
            <Link href={`/products/${id}`} className="block">
                <div className="relative overflow-hidden">
                    <div className="w-full h-64 bg-gray-100">
                        {thumbnail && (
                            <img
                                src={fixMedusaUrl(thumbnail)}
                                alt={title}
                                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                            />
                        )}
                    </div>
                </div>
                <div className="p-4 text-center flex-grow">
                    <h3 className="text-lg font-light text-gray-800 truncate" title={title}>
                        {title}
                    </h3>
                    <p className="mt-2 text-base font-medium text-gray-900">
                        {price ? `₹${(price).toFixed(2)}` : 'N/A'}
                    </p>
                </div>
            </Link>
            <div className="p-4 pt-0 mt-auto">
                <button className="w-full bg-[#C75545] text-white text-sm py-2.5 rounded-md hover:bg-[#b34a3a] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C75545]">
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard
