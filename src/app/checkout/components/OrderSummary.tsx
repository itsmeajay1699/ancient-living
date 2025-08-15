/**
 * Order Summary Component
 * Displays cart items and pricing breakdown
 */

import React from 'react';
import { CartTotals } from '../types/index';
import { fixMedusaUrl } from '@/lib/utils';

interface OrderSummaryProps {
    cart: any; // Use proper cart type from your context
    currency: string;
    totals: CartTotals;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cart, currency, totals }) => {
    return (
        <div className="border rounded-lg p-4 bg-gray-50">
            <h2 className="text-lg font-semibold mb-3">Order Summary</h2>

            {/* Cart Items */}
            {cart?.items && cart.items.length > 0 && (
                <div className="space-y-3 mb-4">
                    {cart.items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-3">
                            {item.thumbnail && (
                                <img
                                    src={fixMedusaUrl(item.thumbnail)}
                                    alt={item.title}
                                    className="w-12 h-12 object-cover rounded"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                    {item.title}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Qty: {item.quantity}
                                </div>
                            </div>
                            <div className="text-sm font-medium">
                                {currency} {((item.total || 0) / 100).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <hr className="my-4" />

            {/* Pricing Breakdown */}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{currency} {totals.subtotal}</span>
                </div>

                {cart?.shipping_total ? (
                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{currency} {totals.shipping}</span>
                    </div>
                ) : (
                    <div className="flex justify-between text-gray-500">
                        <span>Shipping</span>
                        <span>Enter shipping address</span>
                    </div>
                )}

                {cart?.tax_total ? (
                    <div className="flex justify-between">
                        <span>Tax</span>
                        <span>{currency} {totals.tax}</span>
                    </div>
                ) : null}

                <hr className="my-2" />

                <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>{currency} {totals.total}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
