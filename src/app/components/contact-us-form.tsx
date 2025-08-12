"use client"

import { Mail, Phone, MapPin } from "lucide-react"
import { useState } from "react"

export default function ContactUs() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
        // Add API call here
    }

    return (
        <section className="bg-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-center text-3xl font-serif mb-10">
                    CONTACT <span className="text-[#C5563A]">US</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Left Side - Contact Info */}
                    <div className="bg-[#fdf7f4] p-8">
                        <h3 className="text-xl font-serif mb-6">Contact Information</h3>
                        <p className="text-[15px] leading-6 mb-6">
                            Botanical Bloom 5/100 B, Block B, Charch wali Gali, Banna Devi. GT Road,
                            Aligarh Uttar Pradesh 202001.
                        </p>
                        <ul className="space-y-4 text-[15px]">
                            <li className="flex items-center gap-3">
                                <MapPin className="text-[#C5563A] w-5 h-5" />
                                Aligarh, Uttar Pradesh
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-[#C5563A] w-5 h-5" />
                                shivampundir@botanicalbloom.in
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-[#C5563A] w-5 h-5" />
                                +91 9599840666
                            </li>
                        </ul>
                    </div>

                    {/* Right Side - Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="Name"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className="border rounded-md px-4 py-2 w-full outline-none focus:border-[#C5563A]"
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className="border rounded-md px-4 py-2 w-full outline-none focus:border-[#C5563A]"
                            />
                        </div>

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="border rounded-md px-4 py-2 w-full outline-none focus:border-[#C5563A]"
                        />

                        <textarea
                            name="message"
                            placeholder="Message"
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            className="border rounded-md px-4 py-2 w-full outline-none focus:border-[#C5563A]"
                        ></textarea>

                        <button
                            type="submit"
                            className="bg-[#C5563A] text-white w-full py-3 rounded-md font-semibold hover:bg-[#a8452d] transition"
                        >
                            SUBMIT
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
