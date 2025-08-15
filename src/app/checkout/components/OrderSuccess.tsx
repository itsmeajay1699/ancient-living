/**
 * Order Success Component
 * Displays order confirmation after successful checkout
 */

import React from 'react';

interface OrderSuccessProps {
    orderId: string;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderId }) => {
    return (
        <div className="max-w-3xl mx-auto p-6 text-center">
            <div className="mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Thank you! 🎉
                </h1>
                <p className="text-lg text-gray-600 mb-4">
                    Your order has been placed successfully.
                </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 mb-1">Order ID</div>
                <div className="text-lg font-mono font-medium text-gray-900">
                    {orderId}
                </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-8">
                <p>
                    We've sent you an email confirmation with your order details.
                </p>
                <p>
                    You can track your order status in your account dashboard.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                    href="/"
                    className="inline-block bg-green-600 text-white px-6 py-3 rounded font-medium hover:bg-green-700 transition-colors"
                >
                    Continue Shopping
                </a>
                <a
                    href="/account/orders"
                    className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded font-medium hover:bg-gray-50 transition-colors"
                >
                    View Order Details
                </a>
            </div>
        </div>
    );
};

export default OrderSuccess;
