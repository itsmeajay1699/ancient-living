import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const ProductCard = ({ product }: any) => {
    // Default to an empty object to avoid errors if product is null/undefined
    const { id, title, thumbnail, price } = product || {};
    return (
        <div className="group relative flex flex-col overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300">
            <Link href={`/products/${id}/${price}`} className="block">
                <div className="relative overflow-hidden">
                    <div className="w-full h-[200px] bg-gray-100 relative">
                        {thumbnail ? (
                            <Image
                                src={thumbnail}
                                alt={title || 'Product image'}
                                fill
                                className="object-contain object-center transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-300 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-500">No Image</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-4 text-center flex-grow">
                    <h3 className="text-lg font-light text-gray-800 truncate" title={title}>
                        {title}
                    </h3>
                    <p className="mt-2 text-base font-medium text-gray-900">
                        {price ? `₹${(price / 100).toFixed(2)}` : 'N/A'}
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
