/**
 * Shipping Options Component
 * Handles shipping method selection
 */

import React from 'react';
import { ShippingOption } from '../types/index';

interface ShippingSectionProps {
    shippingOptions: ShippingOption[];
    selectedShippingOption: string;
    currency: string;
    formatPrice: (amount?: number) => string;
    onShippingOptionSelect: (optionId: string) => void;
}

const ShippingSection: React.FC<ShippingSectionProps> = ({
    shippingOptions,
    selectedShippingOption,
    currency,
    formatPrice,
    onShippingOptionSelect,
}) => {
    return (
        <section className="border rounded-lg p-4 bg-white">
            <h2 className="text-lg font-semibold mb-3">Shipping method</h2>

            {shippingOptions.length === 0 ? (
                <div className="text-center py-4">
                    <div className="text-gray-500 text-sm">
                        Enter your shipping address to view available methods.
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {shippingOptions.map((option) => (
                        <label
                            key={option.id}
                            className="flex items-center justify-between border rounded p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="shipping"
                                    checked={selectedShippingOption === option.id}
                                    onChange={() => onShippingOptionSelect(option.id)}
                                    className="text-green-600 focus:ring-green-500"
                                />
                                <span className="text-sm font-medium">{option.name}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                                {currency} {formatPrice(option.amount)}
                            </div>
                        </label>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ShippingSection;
