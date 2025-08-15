/**
 * Shared TypeScript types for checkout flow
 */

export interface Address {
    id?: string;
    first_name: string;
    last_name?: string;
    address_1: string;
    address_2?: string;
    city: string;
    province?: string;
    postal_code?: string;
    country_code: string;
    phone?: string;
}

export interface ShippingOption {
    id: string;
    name: string;
    amount?: number;
}

export type PaymentMethod = "razorpay" | "pp_system" | "manual" | "cod";

export interface CartTotals {
    subtotal: string;
    shipping: string;
    tax: string;
    total: string;
}

export interface CheckoutStep {
    id: string;
    title: string;
    completed: boolean;
    current: boolean;
}
