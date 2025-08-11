"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { medusa } from "@/lib/medusa"
import Link from "next/link"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            const cust = await medusa.auth.authenticate({ email, password })
            localStorage.setItem("customer", JSON.stringify(cust))
            router.push("/")
        } catch (err: any) {
            setError("Invalid email or password")
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
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                    >
                        Sign in
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
