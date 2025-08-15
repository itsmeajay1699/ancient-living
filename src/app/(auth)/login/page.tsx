"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { sdk } from "@/lib/medusa"
import { useCart } from "@/context/CartContext"
import Link from "next/link"

export default function LoginPage() {
    const router = useRouter()
    const { associateWithCustomer, loadCustomerCart } = useCart()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            // Use the new SDK for authentication
            const response = await sdk.auth.login("customer", "emailpass", {
                email,
                password,
            })

            if (response) {
                // Get customer information after login
                const { customer } = await sdk.store.customer.retrieve()

                if (customer) {
                    // Store customer data
                    localStorage.setItem("customer", JSON.stringify(customer))
                    // Always load or create customer cart after login
                    try {
                        await loadCustomerCart(customer.email)
                        console.log("Customer cart loaded and associated after login")
                    } catch (cartError) {
                        console.log("Customer cart setup failed:", cartError)
                    }
                    // Trigger a custom event to notify other components
                    window.dispatchEvent(new CustomEvent('customerLogin', {
                        detail: { customer }
                    }))

                    router.push("/")
                } else {
                    setError("Login successful but could not retrieve customer data")
                }
            } else {
                setError("Login failed. Please check your credentials.")
            }
        } catch (err: any) {
            console.error("Login error:", err)
            setError(err.message || "Invalid email or password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center py-[100px] px-4">
            <form onSubmit={handleLogin} className="w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

                {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                    <div className="text-sm text-right">
                        <p>
                            New Customer?{" "}
                            <Link href="/register" className="text-blue-700 hover:underline">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}
