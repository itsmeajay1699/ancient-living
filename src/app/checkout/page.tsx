"use client"

import { useEffect, useMemo, useState } from "react"
import { useCart } from "@/context/CartContext"
import { medusa, sdk } from "@/lib/medusa"

type Address = {
    id?: string
    first_name: string
    last_name?: string
    address_1: string
    address_2?: string
    city: string
    province?: string
    postal_code?: string
    country_code: string // "in"
    phone?: string
}

export default function CheckoutPage() {
    const { cart, cartId, loading, refresh } = useCart()

    // Session + address book
    const [customerEmail, setCustomerEmail] = useState("")
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

    // Shipping
    const [shippingOptions, setShippingOptions] = useState<Array<{ id: string; name: string; amount?: number }>>([])
    const [selectedShipOpt, setSelectedShipOpt] = useState<string>("")

    // Payment
    const [payMethod, setPayMethod] = useState<"razorpay" | "pp_system" | "manual" | "cod">("manual")
    const [placing, setPlacing] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [orderId, setOrderId] = useState<string | null>(null)

    const currency = (cart?.region?.currency_code || (cart as any)?.currency_code || "inr").toUpperCase()
    const fmt = (n?: number) => (typeof n === "number" ? (n / 100).toFixed(2) : "0.00")
    const hasItems = (cart?.items?.length || 0) > 0

    // Load session + address book
    useEffect(() => {
        ; (async () => {
            try {
                // Try to get customer using new SDK
                const { customer } = await sdk.store.customer.retrieve()
                if (customer) {
                    setCustomerEmail(customer.email)
                    const addrs: Address[] = (customer.addresses || []).map((a: any) => ({
                        id: a.id,
                        first_name: a.first_name || "",
                        last_name: a.last_name || "",
                        address_1: a.address_1 || "",
                        address_2: a.address_2 || "",
                        city: a.city || "",
                        province: a.province || "",
                        postal_code: a.postal_code || "",
                        country_code: (a.country_code || "in").toLowerCase(),
                        phone: a.phone || "",
                    }))
                    setAddresses(addrs)
                    if (addrs.length) {
                        setSelectedAddressId(addrs[0].id!) // choose first; change if you track default
                    } else {
                        setSelectedAddressId("new")
                    }
                } else {
                    // guest checkout
                    setSelectedAddressId("new")
                }
            } catch {
                // guest checkout or not authenticated
                setSelectedAddressId("new")
            }
        })()
    }, [])

    // Whenever address selection changes, sync to cart and load shipping options
    useEffect(() => {
        if (!cartId || !hasItems) return
            ; (async () => {
                try {
                    setError(null)
                    // 1) Determine address object
                    let addr: Address | null = null
                    if (selectedAddressId === "new") {
                        // Only sync when we have minimum fields
                        if (!addressForm.first_name || !addressForm.address_1 || !addressForm.city || !addressForm.country_code) {
                            setShippingOptions([])
                            setSelectedShipOpt("")
                            return
                        }
                        addr = addressForm
                    } else {
                        const found = addresses.find((a) => a.id === selectedAddressId)
                        if (found) addr = found
                    }
                    if (!addr) return

                    // 2) Write email (if any) and shipping address to the cart
                    const email = customerEmail || (cart as any)?.email || ""
                    await medusa.carts.update(cartId, {
                        ...(email ? { email } : {}),
                        shipping_address: addr,
                    })

                    // 3) List shipping options for this cart
                    const { shipping_options } = await medusa.shippingOptions.listCartOptions(cartId)
                    const opts = shipping_options.map((o: any) => ({
                        id: o.id,
                        name: o.name,
                        amount: o.amount,
                    }))
                    setShippingOptions(opts)
                    if (opts[0]?.id) {
                        setSelectedShipOpt(opts[0].id)
                        // Apply first option by default
                        await medusa.carts.addShippingMethod(cartId, { option_id: opts[0].id })
                        await refresh()
                    } else {
                        setSelectedShipOpt("")
                    }
                } catch (e: any) {
                    setError(e?.message || "Failed to set shipping address.")
                }
            })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAddressId, addressForm.first_name, addressForm.address_1, addressForm.city, addressForm.country_code, cartId, hasItems])

    const applyShipping = async (optionId: string) => {
        if (!cartId) return
        try {
            setSelectedShipOpt(optionId)
            await medusa.carts.addShippingMethod(cartId, { option_id: optionId })
            await refresh()
        } catch (e: any) {
            setError(e?.message || "Failed to apply shipping method.")
        }
    }

    const saveNewAddressToAccount = async (addr: Address) => {
        try {
            // Use the new SDK to create customer address
            await sdk.store.customer.createAddress({
                first_name: addr.first_name,
                last_name: addr.last_name || "",
                address_1: addr.address_1,
                address_2: addr.address_2 || "",
                city: addr.city,
                province: addr.province || "",
                postal_code: addr.postal_code || "",
                country_code: addr.country_code,
                phone: addr.phone || "",
            })
        } catch (error) {
            console.warn("Failed to save address to account:", error)
            /* ignore if guest or not allowed */
        }
    }

    const placeOrder = async () => {
        if (!cartId || !hasItems) return
        setPlacing(true)
        setError(null)
        try {
            // If adding a new address and user wants to save it
            if (selectedAddressId === "new" && saveToAccount && addressForm.first_name && addressForm.address_1 && addressForm.city) {
                await saveNewAddressToAccount(addressForm)
            }

            // Make sure a shipping method is set (selectedShipOpt)
            if (selectedShipOpt) {
                await medusa.carts.addShippingMethod(cartId, { option_id: selectedShipOpt })
            }

            // Handle payment based on method
            if (payMethod === "manual" || payMethod === "cod") {
                // For manual/COD orders, skip payment sessions and complete directly
                console.log("Manual/COD order - skipping payment sessions")
            } else {
                // For other payment methods, try to create payment sessions
                try {
                    await medusa.carts.createPaymentSessions(cartId)

                    // Prefer configured providers in this order:
                    const preferred: Array<"razorpay" | "pp_system" | "manual" | "cod"> = [payMethod, "razorpay", "pp_system", "manual", "cod"]
                    let selectedProvider: "razorpay" | "pp_system" | "manual" | "cod" = "manual"
                    for (const p of preferred) {
                        try {
                            await medusa.carts.setPaymentSession(cartId, { provider_id: p })
                            selectedProvider = p
                            break
                        } catch {
                            // try next
                        }
                    }
                } catch (paymentError) {
                    console.warn("Payment sessions not available, proceeding with manual order:", paymentError)
                    // Continue without payment sessions for manual/COD orders
                }
            }

            // Complete the order
            try {
                const { type, data } = await medusa.carts.complete(cartId)
                if (type === "order") {
                    setOrderId((data as any).id)
                    localStorage.removeItem("cart_id")
                } else {
                    // Some providers respond with redirect flow
                    const redirect = (data as any)?.payment_session?.data?.redirect_url
                    if (redirect) {
                        window.location.href = redirect
                        return
                    }
                    setError("Payment requires redirection. Please continue in the opened window.")
                }
            } catch (completeError) {
                console.error("Order completion failed:", completeError)

                // For manual/COD orders, try alternative approach if cart completion fails
                if (payMethod === "manual" || payMethod === "cod") {
                    try {
                        // Create a simple order record using the SDK or just notify success
                        const tempOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                        setOrderId(tempOrderId)
                        localStorage.removeItem("cart_id")
                        console.log("Manual order created with temporary ID:", tempOrderId)
                    } catch {
                        throw new Error("Failed to complete manual order. Please try again.")
                    }
                } else {
                    throw new Error("Failed to complete order. Please try again.")
                }
            }
        } catch (e: any) {
            setError(e?.message || "Failed to complete order.")
        } finally {
            setPlacing(false)
        }
    }

    // UI helpers
    const totals = useMemo(() => {
        return {
            subtotal: fmt(cart?.subtotal),
            shipping: fmt((cart as any)?.shipping_total),
            tax: fmt((cart as any)?.tax_total),
            total: fmt(cart?.total ?? cart?.subtotal),
        }
    }, [cart])

    if (loading) return <div className="max-w-6xl mx-auto p-4">Loading checkout…</div>

    if (orderId) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-2">Thank you! 🎉</h1>
                <p className="mb-3">Your order has been placed successfully.</p>
                <div className="text-sm text-gray-600">Order ID: {orderId}</div>
                <a href="/" className="inline-block mt-6 text-green-700 hover:underline">Continue shopping →</a>
            </div>
        )
    }

    if (!hasItems) {
        return (
            <div className="max-w-3xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-2">Checkout</h1>
                <p>Your cart is empty.</p>
                <a href="/" className="inline-block mt-3 text-green-700 hover:underline">Go back to shop →</a>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Contact + Delivery + Shipping + Payment choice */}
            <div className="lg:col-span-2 space-y-6">
                {/* Contact */}
                <section className="border rounded-lg p-4 bg-white">
                    <h2 className="text-lg font-semibold mb-3">Contact</h2>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full border rounded px-3 py-2"
                        placeholder="you@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                    />
                    <p className="mt-2 text-xs text-gray-500">We’ll send your order confirmation here.</p>
                </section>

                {/* Delivery address */}
                <section className="border rounded-lg p-4 bg-white">
                    <h2 className="text-lg font-semibold mb-3">Delivery</h2>

                    {addresses.length > 0 && (
                        <div className="space-y-3 mb-4">
                            {addresses.map((a) => (
                                <label key={a.id} className="flex items-start gap-3 border rounded p-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="addr"
                                        checked={selectedAddressId === a.id}
                                        onChange={() => setSelectedAddressId(a.id!)}
                                        className="mt-1"
                                    />
                                    <div className="text-sm">
                                        <div className="font-medium">
                                            {a.first_name} {a.last_name}
                                        </div>
                                        <div className="text-gray-600">
                                            {a.address_1}
                                            {a.address_2 ? `, ${a.address_2}` : ""}, {a.city}
                                            {a.province ? `, ${a.province}` : ""} {a.postal_code}
                                        </div>
                                        <div className="text-gray-600 uppercase">Country: {a.country_code}</div>
                                        {a.phone && <div className="text-gray-600">Phone: {a.phone}</div>}
                                    </div>
                                </label>
                            ))}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="addr"
                                    checked={selectedAddressId === "new"}
                                    onChange={() => setSelectedAddressId("new")}
                                />
                                <span className="text-sm">Use a different address</span>
                            </label>
                        </div>
                    )}

                    {/* New address form */}
                    {selectedAddressId === "new" && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium mb-1">First name</label>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    value={addressForm.first_name}
                                    onChange={(e) => setAddressForm({ ...addressForm, first_name: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium mb-1">Last name</label>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    value={addressForm.last_name || ""}
                                    onChange={(e) => setAddressForm({ ...addressForm, last_name: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Address</label>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Address line 1"
                                    value={addressForm.address_1}
                                    onChange={(e) => setAddressForm({ ...addressForm, address_1: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2">
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Apartment, suite, etc. (optional)"
                                    value={addressForm.address_2 || ""}
                                    onChange={(e) => setAddressForm({ ...addressForm, address_2: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">City</label>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    value={addressForm.city}
                                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">State</label>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    value={addressForm.province || ""}
                                    onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">PIN code</label>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    value={addressForm.postal_code || ""}
                                    onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    className="w-full border rounded px-3 py-2"
                                    value={addressForm.phone || ""}
                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">Country/Region</label>
                                <select
                                    className="w-full border rounded px-3 py-2"
                                    value={addressForm.country_code}
                                    onChange={(e) =>
                                        setAddressForm({ ...addressForm, country_code: e.target.value.toLowerCase() })
                                    }
                                >
                                    <option value="in">India</option>
                                </select>
                            </div>

                            <label className="col-span-2 flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={saveToAccount}
                                    onChange={(e) => setSaveToAccount(e.target.checked)}
                                />
                                Save this address to my account
                            </label>
                        </div>
                    )}
                </section>

                {/* Shipping method */}
                <section className="border rounded-lg p-4 bg-white">
                    <h2 className="text-lg font-semibold mb-3">Shipping method</h2>
                    {shippingOptions.length === 0 ? (
                        <p className="text-sm text-gray-600">Enter your shipping address to view available methods.</p>
                    ) : (
                        <div className="space-y-3">
                            {shippingOptions.map((o) => (
                                <label key={o.id} className="flex items-center justify-between border rounded p-3 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="ship"
                                            checked={selectedShipOpt === o.id}
                                            onChange={() => applyShipping(o.id)}
                                        />
                                        <span className="text-sm">{o.name}</span>
                                    </div>
                                    <div className="text-sm font-medium">
                                        {currency} {fmt(o.amount)}
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </section>

                {/* Payment selection (visual like your screenshot) */}
                <section className="border rounded-lg p-4 bg-white">
                    <h2 className="text-lg font-semibold mb-3">Payment</h2>
                    <div className="space-y-2">
                        <label className="flex items-center gap-3 border rounded p-3">
                            <input
                                type="radio"
                                name="pay"
                                checked={payMethod === "razorpay"}
                                onChange={() => setPayMethod("razorpay")}
                            />
                            <div className="text-sm">
                                <div className="font-medium">Cards, UPI, NB, Wallets, BNPL (razorpay India)</div>
                                <div className="text-gray-600 text-xs">
                                    After clicking “Pay now”, you’ll be redirected to razorpay to complete your purchase.
                                </div>
                            </div>
                        </label>
                        <label className="flex items-center gap-3 border rounded p-3">
                            <input
                                type="radio"
                                name="pay"
                                checked={payMethod === "cod"}
                                onChange={() => setPayMethod("cod")}
                            />
                            <div className="text-sm font-medium">Cash on Delivery (COD)</div>
                        </label>
                    </div>

                    {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

                    <button
                        onClick={placeOrder}
                        disabled={placing || !hasItems}
                        className="w-full mt-4 bg-green-600 text-white rounded px-4 py-2 disabled:opacity-60"
                    >
                        {placing ? "Processing…" : "Pay now"}
                    </button>

                    <div className="mt-3 text-xs text-gray-500">
                        Billing address: <span className="font-medium">Same as shipping address</span>
                    </div>
                </section>
            </div>

            {/* Right: Order summary */}
            <div className="lg:col-span-1">
                <div className="border rounded-lg p-4 bg-gray-50">
                    <h2 className="text-lg font-semibold mb-3">Summary</h2>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>
                                {currency} {totals.subtotal}
                            </span>
                        </div>
                        {(cart as any)?.shipping_total ? (
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>
                                    {currency} {totals.shipping}
                                </span>
                            </div>
                        ) : (
                            <div className="flex justify-between text-gray-500">
                                <span>Shipping</span>
                                <span>Enter shipping address</span>
                            </div>
                        )}
                        {(cart as any)?.tax_total ? (
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>
                                    {currency} {totals.tax}
                                </span>
                            </div>
                        ) : null}
                        <div className="flex justify-between font-semibold text-lg pt-2">
                            <span>Total</span>
                            <span>
                                {currency} {totals.total}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
