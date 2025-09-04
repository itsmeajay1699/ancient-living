"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { sdk } from "@/lib/medusa"
import { useCart } from "@/context/CartContext"
import Link from "next/link"

export default function RegisterPage() {
    const router = useRouter()
    const { associateWithCustomer } = useCart()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        if (!firstName || !lastName || !email || !password) {
            setError("Please fill in all fields")
            setLoading(false)
            return
        }

        try {
            // Step 1: Register with email/password to get registration token
            await sdk.auth.register("customer", "emailpass", {
                email,
                password,
            })
        } catch (error: any) {
            // Check if it's an existing identity error
            if (error.message?.includes("Identity with email already exists")) {
                try {
                    // Try to login with existing credentials
                    await sdk.auth.login("customer", "emailpass", {
                        email,
                        password,
                    })
                } catch (loginError: any) {
                    setError("Email already exists with different password")
                    setLoading(false)
                    return
                }
            } else {
                setError(error.message || "Registration failed")
                setLoading(false)
                return
            }
        }

        try {
            // Step 2: Create customer with the authentication token
            const { customer } = await sdk.store.customer.create({
                first_name: firstName,
                last_name: lastName,
                email,
            })

            if (customer) {
                // Registration successful, redirect to login
                router.push("/login?message=Registration successful! Please log in.")
            }
        } catch (err: any) {
            console.error("Customer creation error:", err)
            setError(err.message || "Account creation failed. Please try again.")
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
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Join us and start shopping</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                    First name
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="First name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C75545] focus:border-[#C75545] transition-colors duration-200 outline-none"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Last name
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="Last name"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C75545] focus:border-[#C75545] transition-colors duration-200 outline-none"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>

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
                                placeholder="Create a password"
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
                                    Creating account...
                                </div>
                            ) : (
                                "Create account"
                            )}
                        </button>

                        <div className="text-center pt-4">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link href="/login" className="font-medium text-[#C75545] hover:text-[#b34a3a] transition-colors duration-200">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
