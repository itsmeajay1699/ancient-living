"use client"

/**
 * Checkout Page - Pure Medusa v2 SDK Implementation
 * Modern, clean architecture using only Medusa v2 APIs
 */

import { useEffect, useState } from "react"
import { useCart } from "@/context/CartContext"
import { sdk } from "@/lib/medusa"

// Import our modular components
import ContactSection from './components/ContactSection'
import AddressSection from './components/AddressSection'
import ShippingSection from './components/ShippingSection'
import PaymentSection from './components/PaymentSection'
import OrderSummary from './components/OrderSummary'
import OrderSuccess from './components/OrderSuccess'
import EmptyCart from './components/EmptyCart'

// Import types
import { Address, PaymentMethod } from './types/index'
import { REGION_ID } from "@/config/constants"

export default function CheckoutPage() {
    const { cart, cartId, loading, refresh, clearCart } = useCart()

    // Contact state
    const [customerEmail, setCustomerEmail] = useState("")

    // Address state
    const [addresses, setAddresses] = useState<Address[]>([])
    const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new")
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
    })
    const [saveToAccount, setSaveToAccount] = useState(true)

    // Shipping state
    const [shippingOptions, setShippingOptions] = useState<Array<{ id: string; name: string; amount?: number }>>([])
    const [selectedShippingOption, setSelectedShippingOption] = useState<string>("")

    // Payment state
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("manual")
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [orderId, setOrderId] = useState<string | null>(null)

    // Computed values
    const currency = (cart?.region?.currency_code || "inr").toUpperCase()
    const formatPrice = (n?: number) => (typeof n === "number" ? (n).toFixed(2) : "0.00")
    const hasItems = (cart?.items?.length || 0) > 0

    // Load customer addresses on mount
    useEffect(() => {
        loadCustomerAddresses()
    }, [])

    // Auto-populate email from cart if available (remove since cart.email doesn't exist)
    // useEffect(() => {
    //     if (cart?.email && !customerEmail) {
    //         setCustomerEmail(cart.email)
    //     }
    // }, [cart?.email, customerEmail])

    // Load shipping options when address is set
    useEffect(() => {
        if (cartId && (selectedAddressId !== "new" || addressForm.address_1)) {
            loadShippingOptions()
        }
    }, [cartId, selectedAddressId, addressForm.address_1])

    /**
     * Load customer addresses using Medusa v2 SDK
     */
    const loadCustomerAddresses = async () => {
        try {
            const response = await sdk.store.customer.listAddress()
            if (response.addresses) {
                setAddresses(response.addresses.map((addr: any) => ({
                    id: addr.id,
                    first_name: addr.first_name || "",
                    last_name: addr.last_name || "",
                    address_1: addr.address_1 || "",
                    address_2: addr.address_2 || "",
                    city: addr.city || "",
                    province: addr.province || "",
                    postal_code: addr.postal_code || "",
                    country_code: addr.country_code || "in",
                    phone: addr.phone || "",
                })))
            }
        } catch (error) {
            console.warn("Could not load customer addresses:", error)
        }
    }

    /**
     * Load shipping options using Medusa v2 SDK
     */
    const loadShippingOptions = async () => {
        if (!cartId) return

        try {
            const response = await sdk.store.fulfillment.listCartOptions({ cart_id: cartId })
            if (response.shipping_options) {
                const options = response.shipping_options.map((option: any) => ({
                    id: option.id,
                    name: option.name,
                    amount: option.amount,
                }))
                setShippingOptions(options)

                // Auto-select first option if none selected
                if (options.length > 0 && !selectedShippingOption) {
                    setSelectedShippingOption(options[0].id)
                }
            }
        } catch (error) {
            console.error("Failed to load shipping options:", error)
            setShippingOptions([])
        }
    }

    /**
     * Save new address to customer account using Medusa v2 SDK
     */
    const saveNewAddressToAccount = async (address: Address) => {
        try {
            await sdk.store.customer.createAddress({
                first_name: address.first_name,
                last_name: address.last_name,
                address_1: address.address_1,
                address_2: address.address_2,
                city: address.city,
                province: address.province,
                postal_code: address.postal_code,
                country_code: address.country_code,
                phone: address.phone,
            })
        } catch (error) {
            console.warn("Could not save address to account:", error)
        }
    }

    /**
     * Complete order using pure Medusa v2 SDK flow
     */
    const completeOrder = async () => {
        if (!cartId) return

        setIsProcessing(true)
        setError(null)

        try {
            // Step 1: Update cart with customer email
            if (customerEmail) {
                await sdk.store.cart.update(cartId, { email: customerEmail })
            }

            // Step 2: Set billing/shipping address
            const addressToUse = selectedAddressId === "new" ? addressForm : addresses.find(a => a.id === selectedAddressId)
            if (addressToUse) {
                const { id, ...addressData } = addressToUse
                await sdk.store.cart.update(cartId, {
                    billing_address: addressData,
                    shipping_address: addressData,
                })
            }

            // Step 3: Save address to account if requested
            if (selectedAddressId === "new" && saveToAccount && addressForm.first_name) {
                await saveNewAddressToAccount(addressForm)
            }

            // Step 4: Add shipping method
            if (selectedShippingOption) {
                await sdk.store.cart.addShippingMethod(cartId, { option_id: selectedShippingOption })
            }

            const cartStore = await sdk.store.cart.retrieve(cartId)

            await sdk.store.payment.initiatePaymentSession(cartStore.cart, { provider_id: paymentMethod })

            const orderResponse = await sdk.store.cart.complete(cartId)

            if (orderResponse.type === "order") {
                console.log("Order completed successfully!")
                setOrderId(orderResponse.order.id)

                // Clear the cart completely - this will remove cartId, cart data, and localStorage
                clearCart()

            } else {
                throw new Error("Order completion failed - invalid response type")
            }
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else if (typeof error === "string") {
                setError(error)
            } else {
                setError("Failed to complete order. Please try again.")
            }
        } finally {
            setIsProcessing(false)
        }
    }



    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
        )
    }

    // Show empty cart if no items
    if (!hasItems) {
        return <EmptyCart />
    }

    // Show order success if completed
    if (orderId) {
        return <OrderSuccess orderId={orderId} />
    }


    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Checkout Form */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h1 className="text-2xl font-semibold text-gray-900 mb-6">Checkout</h1>

                            <ContactSection
                                email={customerEmail}
                                setEmail={setCustomerEmail}
                            />

                            <AddressSection
                                addresses={addresses}
                                selectedAddressId={selectedAddressId}
                                setSelectedAddressId={setSelectedAddressId}
                                addressForm={addressForm}
                                setAddressForm={setAddressForm}
                                saveToAccount={saveToAccount}
                                setSaveToAccount={setSaveToAccount}
                            />

                            <ShippingSection
                                shippingOptions={shippingOptions}
                                selectedShippingOption={selectedShippingOption}
                                onShippingOptionSelect={setSelectedShippingOption}
                                currency={currency}
                                formatPrice={formatPrice}
                            />

                            <PaymentSection
                                paymentMethod={paymentMethod}
                                setPaymentMethod={setPaymentMethod}
                                isProcessing={isProcessing}
                                isDisabled={!customerEmail || !selectedShippingOption}
                                error={error}
                                onCompleteOrder={completeOrder}
                            />
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <OrderSummary
                            cart={cart}
                            currency={currency}
                            totals={{
                                subtotal: formatPrice(cart?.subtotal),
                                shipping: formatPrice((cart as any)?.shipping_total || 0),
                                tax: formatPrice((cart as any)?.tax_total || 0),
                                total: formatPrice(cart?.total),
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
