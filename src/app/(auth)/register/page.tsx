"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { medusa } from "@/lib/medusa"
import Link from "next/link"

export default function RegisterPage() {
    const router = useRouter()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        try {
            await medusa.customers.create({
                email,
                password,
                first_name: firstName,
                last_name: lastName,
            })

            router.push("/login")
        } catch (err) {
            setError("Account creation failed. Try another email.")
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
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                    >
                        Create
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
