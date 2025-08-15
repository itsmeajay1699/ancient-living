import React from 'react';
import { PaymentMethod } from '../types/index';

interface PaymentSectionProps {
    paymentMethod: PaymentMethod;
    setPaymentMethod: (method: PaymentMethod) => void;
    isProcessing: boolean;
    isDisabled: boolean;
    error: string | null;
    onCompleteOrder: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    isDisabled,
    error,
    onCompleteOrder,
}) => {
    const paymentOptions = [
        // {
        //     id: "pp_razorpay_razorpay" as PaymentMethod,
        //     title: "Cards, UPI, NB, Wallets, BNPL (Razorpay India)",
        //     description: "After clicking \"Pay now\", you'll be redirected to Razorpay to complete your purchase.",
        // },
        {
            id: "pp_system_default" as PaymentMethod,
            title: "Cash on Delivery / Default",
            description: "Pay with cash on delivery or alternative offline methods.",
        },
    ];

    return (
        <section className="border rounded-lg p-4 bg-white">
            <h2 className="text-lg font-semibold mb-3">Payment</h2>

            <div className="space-y-2 mb-4">
                {paymentOptions.map((option) => (
                    <label
                        key={option.id}
                        className="flex items-start gap-3 border rounded p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                        <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === option.id}
                            onChange={() => setPaymentMethod(option.id)}
                            className="mt-1 text-green-600 focus:ring-green-500"
                        />
                        <div className="text-sm">
                            <div className="font-medium">{option.title}</div>
                            <div className="text-gray-600 text-xs mt-1">
                                {option.description}
                            </div>
                        </div>
                    </label>
                ))}
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                    <div className="font-medium">Error</div>
                    <div>{error}</div>
                </div>
            )}

            <button
                onClick={onCompleteOrder}
                disabled={isDisabled}
                className="w-full bg-green-600 text-white rounded px-4 py-3 disabled:opacity-60 disabled:cursor-not-allowed hover:bg-green-700 transition-colors font-medium"
            >
                {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        Processing…
                    </div>
                ) : (
                    "Pay now"
                )}
            </button>

            <div className="mt-3 text-xs text-gray-500 text-center">
                Billing address: <span className="font-medium">Same as shipping address</span>
            </div>
        </section>
    );
};

export default PaymentSection;
