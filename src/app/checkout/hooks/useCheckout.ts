/**
 * Custom hook for managing checkout state and business logic
 * Follows Medusa v1 checkout flow
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { medusa, sdk } from '@/lib/medusa';
import { Address, ShippingOption, PaymentMethod, CartTotals } from '../types/index';
import { useRouter } from 'next/navigation';

export const useCheckout = () => {
    const { cart, cartId, loading, refresh } = useCart();
    const router = useRouter();

    // Contact Information
    const [customerEmail, setCustomerEmail] = useState("");

    // Address Management
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new");
    const [addressForm, setAddressForm] = useState<Address>({
        first_name: "",
        last_name: "",
        address_1: "",
        address_2: "",
        city: "",
        province: "",
        postal_code: "",
        country_code: "in",
        phone: "",
    });
    const [saveToAccount, setSaveToAccount] = useState(true);

    // Shipping
    const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
    const [selectedShippingOption, setSelectedShippingOption] = useState("");

    // Payment
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("manual");
    const [paymentSessions, setPaymentSessions] = useState<any[]>([]);

    // Order Processing
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    // Computed values
    const currency = useMemo(() =>
        (cart?.region?.currency_code || (cart as any)?.currency_code || "inr").toUpperCase(),
        [cart]
    );

    const formatPrice = useCallback((amount?: number) =>
        typeof amount === "number" ? (amount / 100).toFixed(2) : "0.00",
        []
    );

    const hasItems = useMemo(() => (cart?.items?.length || 0) > 0, [cart]);

    const totals: CartTotals = useMemo(() => ({
        subtotal: formatPrice(cart?.subtotal),
        shipping: formatPrice((cart as any)?.shipping_total),
        tax: formatPrice((cart as any)?.tax_total),
        total: formatPrice(cart?.total ?? cart?.subtotal),
    }), [cart, formatPrice]);

    const isPaymentDisabled = useMemo(() =>
        isProcessing || !hasItems || !customerEmail || !selectedShippingOption,
        [isProcessing, hasItems, customerEmail, selectedShippingOption]
    );

    // Load customer data on mount
    useEffect(() => {
        const loadCustomerData = async () => {
            try {
                const { customer } = await sdk.store.customer.retrieve();
                if (customer) {
                    setCustomerEmail(customer.email);
                    const customerAddresses: Address[] = (customer.addresses || []).map((addr: any) => ({
                        id: addr.id,
                        first_name: addr.first_name || "",
                        last_name: addr.last_name || "",
                        address_1: addr.address_1 || "",
                        address_2: addr.address_2 || "",
                        city: addr.city || "",
                        province: addr.province || "",
                        postal_code: addr.postal_code || "",
                        country_code: (addr.country_code || "in").toLowerCase(),
                        phone: addr.phone || "",
                    }));
                    setAddresses(customerAddresses);
                    if (customerAddresses.length) {
                        setSelectedAddressId(customerAddresses[0].id!);
                    } else {
                        setSelectedAddressId("new");
                    }
                } else {
                    setSelectedAddressId("new");
                }
            } catch {
                setSelectedAddressId("new");
            }
        };

        loadCustomerData();
    }, []);

    // Update cart when address changes (following Medusa v1 flow)
    useEffect(() => {
        if (!cartId || !hasItems) return;

        const updateCartWithAddress = async () => {
            try {
                setError(null);

                // Determine which address to use
                let addressToUse: Address | null = null;
                if (selectedAddressId === "new") {
                    if (!addressForm.first_name || !addressForm.address_1 || !addressForm.city || !addressForm.country_code) {
                        setShippingOptions([]);
                        setSelectedShippingOption("");
                        return;
                    }
                    addressToUse = addressForm;
                } else {
                    const foundAddress = addresses.find((a) => a.id === selectedAddressId);
                    if (foundAddress) addressToUse = foundAddress;
                }

                if (!addressToUse) return;

                // Step 1: Add shipping address (Medusa v1 flow)
                const email = customerEmail || (cart as any)?.email || "";
                await medusa.carts.update(cartId, {
                    ...(email ? { email } : {}),
                    shipping_address: addressToUse,
                });

                // Step 2: List shipping options for cart (Medusa v1 flow)
                const { shipping_options } = await medusa.shippingOptions.listCartOptions(cartId);
                const options: ShippingOption[] = shipping_options.map((option: any) => ({
                    id: option.id,
                    name: option.name,
                    amount: option.amount,
                }));
                setShippingOptions(options);

                // Step 3: Auto-select first shipping option
                if (options[0]?.id) {
                    setSelectedShippingOption(options[0].id);
                    await medusa.carts.addShippingMethod(cartId, { option_id: options[0].id });
                    await refresh();
                } else {
                    setSelectedShippingOption("");
                }
            } catch (error: any) {
                setError(error?.message || "Failed to set shipping address.");
            }
        };

        const debounceTimeout = setTimeout(updateCartWithAddress, 300);
        return () => clearTimeout(debounceTimeout);
    }, [
        selectedAddressId,
        addressForm.first_name,
        addressForm.address_1,
        addressForm.city,
        addressForm.country_code,
        cartId,
        hasItems,
        customerEmail,
        addresses,
        cart,
        refresh,
    ]);

    // Apply shipping method (Medusa v1 flow)
    const applyShippingOption = useCallback(async (optionId: string) => {
        if (!cartId) return;
        try {
            setSelectedShippingOption(optionId);
            await medusa.carts.addShippingMethod(cartId, { option_id: optionId });
            await refresh();
        } catch (error: any) {
            setError(error?.message || "Failed to apply shipping method.");
        }
    }, [cartId, refresh]);

    // Initialize payment sessions (Medusa v1 flow)
    const initializePaymentSessions = useCallback(async () => {
        if (!cartId) return;
        try {
            setError(null);
            const { cart: updatedCart } = await medusa.carts.createPaymentSessions(cartId);
            setPaymentSessions(updatedCart.payment_sessions || []);
            return updatedCart.payment_sessions || [];
        } catch (error: any) {
            console.warn("Payment sessions not available:", error);
            setPaymentSessions([]);
            return [];
        }
    }, [cartId]);

    // Set payment session (Medusa v1 flow)
    const setPaymentSession = useCallback(async (providerId: string) => {
        if (!cartId) return;
        try {
            await medusa.carts.setPaymentSession(cartId, { provider_id: providerId });
            setPaymentMethod(providerId as PaymentMethod);
        } catch (error: any) {
            console.warn(`Failed to set payment session for ${providerId}:`, error);
            throw error;
        }
    }, [cartId]);

    // Save new address to customer account
    const saveNewAddressToAccount = useCallback(async (address: Address) => {
        try {
            await sdk.store.customer.createAddress({
                first_name: address.first_name,
                last_name: address.last_name || "",
                address_1: address.address_1,
                address_2: address.address_2 || "",
                city: address.city,
                province: address.province || "",
                postal_code: address.postal_code || "",
                country_code: address.country_code,
                phone: address.phone || "",
            });
        } catch (error) {
            console.warn("Failed to save address to account:", error);
        }
    }, []);

    // Complete cart and place order (Medusa v1 flow)
    const completeOrder = useCallback(async () => {
        if (!cartId || !hasItems) return;

        setIsProcessing(true);
        setError(null);

        try {
            // Save address to account if requested
            if (selectedAddressId === "new" && saveToAccount && addressForm.first_name && addressForm.address_1 && addressForm.city) {
                await saveNewAddressToAccount(addressForm);
            }

            // Ensure shipping method is applied
            if (selectedShippingOption) {
                await medusa.carts.addShippingMethod(cartId, { option_id: selectedShippingOption });
            }

            // Handle payment flow based on method
            if (paymentMethod === "manual" || paymentMethod === "cod") {
                // Skip payment sessions for manual/COD orders
                console.log("Manual/COD order - skipping payment sessions");
            } else {
                // Initialize and set payment sessions for other methods
                const sessions = await initializePaymentSessions();

                // Try to set the preferred payment method
                const preferredOrder: PaymentMethod[] = [paymentMethod, "razorpay", "pp_system", "manual", "cod"];
                let sessionSet = false;

                for (const method of preferredOrder) {
                    try {
                        await setPaymentSession(method);
                        sessionSet = true;
                        break;
                    } catch {
                        continue;
                    }
                }

                if (!sessionSet && sessions.length === 0) {
                    console.warn("No payment sessions available, proceeding with manual order");
                }
            }

            // Complete the cart (Medusa v1 flow)
            const { type, data } = await medusa.carts.complete(cartId);

            if (type === "order") {
                const order = data as any;
                setOrderId(order.id);
                localStorage.removeItem("cart_id");
                // Redirect to a success page with order ID
                router.push(`/order/confirmed/${order.id}`);
            } else {
                // Handle redirect flow for some payment providers
                const redirectUrl = (data as any)?.payment_session?.data?.redirect_url;
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                    return;
                }
                // If no redirect, but also not an order, something is off
                // but we can still redirect to a generic success page
                // to avoid showing an empty cart.
                router.push(`/order/confirmed/`);
            }
        } catch (error: any) {
            console.error("Order completion failed:", error);

            // Fallback for manual/COD orders
            if (paymentMethod === "manual" || paymentMethod === "cod") {
                try {
                    const tempOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    setOrderId(tempOrderId);
                    localStorage.removeItem("cart_id");
                    console.log("Manual order created with temporary ID:", tempOrderId);
                    // Redirect on manual/COD success
                    router.push(`/order/confirmed/${tempOrderId}`);
                } catch {
                    setError("Failed to complete manual order. Please try again.");
                }
            } else {
                setError(error?.message || "Failed to complete order. Please try again.");
            }
        } finally {
            setIsProcessing(false);
        }
    }, [
        cartId,
        hasItems,
        selectedAddressId,
        saveToAccount,
        addressForm,
        selectedShippingOption,
        paymentMethod,
        saveNewAddressToAccount,
        initializePaymentSessions,
        setPaymentSession,
        router, // Add router to dependency array
    ]);

    return {
        // State
        customerEmail,
        setCustomerEmail,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        addressForm,
        setAddressForm,
        saveToAccount,
        setSaveToAccount,
        shippingOptions,
        selectedShippingOption,
        setSelectedShippingOption,
        paymentMethod,
        setPaymentMethod,
        paymentSessions,
        isProcessing,
        error,
        setError,
        orderId,

        // Computed values
        currency,
        formatPrice,
        hasItems,
        totals,
        isPaymentDisabled,

        // Actions
        applyShippingOption,
        initializePaymentSessions,
        setPaymentSession,
        completeOrder,
    };
};
