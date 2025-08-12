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
        <div className="flex justify-center items-center py-[100px] px-4">
            <form onSubmit={handleRegister} className="w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center">Create account</h1>

                {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="First name"
                        className="w-1/2 border border-gray-300 rounded px-4 py-2 focus:outline-none"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last name"
                        className="w-1/2 border border-gray-300 rounded px-4 py-2 focus:outline-none"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

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
                        {loading ? "Creating..." : "Create"}
                    </button>

                    <p className="text-sm">
                        Returning customer?{" "}
                        <Link href="/login" className="text-blue-700 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}
