/**
 * Empty Cart Component
 * Displays message when cart is empty
 */

import React from 'react';

const EmptyCart: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto p-6 text-center">
            <div className="mb-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Your cart is empty
                </h1>
                <p className="text-gray-600 mb-6">
                    Add some products to your cart to proceed with checkout.
                </p>
            </div>

            <a
                href="/"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded font-medium hover:bg-green-700 transition-colors"
            >
                Start Shopping
            </a>
        </div>
    );
};

export default EmptyCart;
