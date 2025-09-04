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
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center pt-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C75545] focus:border-[#C75545] transition-colors duration-200 outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C75545] focus:border-[#C75545] transition-colors duration-200 outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#C75545] hover:bg-[#b34a3a] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-[#C75545] focus:ring-offset-2"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </div>
                            ) : (
                                "Sign in"
                            )}
                        </button>

                        <div className="text-center pt-4">
                            <p className="text-sm text-gray-600">
                                New to our store?{" "}
                                <Link href="/register" className="font-medium text-[#C75545] hover:text-[#b34a3a] transition-colors duration-200">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
