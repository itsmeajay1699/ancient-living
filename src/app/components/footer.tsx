"use client"

import { Select, Input, Button } from "antd"
import {
    FacebookFilled,
    InstagramOutlined,
    DownOutlined,
} from "@ant-design/icons"

export default function Footer() {
    return (
        <footer className="bg-[#F5F3ED] text-gray-800 px-6 py-10 mt-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Follow Us */}
                <div>
                    <h4 className="font-bold mb-4">Follow us</h4>
                    <div className="flex space-x-3 text-2xl">
                        <FacebookFilled className="hover:text-gray-600 cursor-pointer" />
                        <InstagramOutlined className="hover:text-gray-600 cursor-pointer" />
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <h4 className="font-bold mb-4">Categories</h4>
                    <ul className="space-y-2 text-sm">
                        <li><a href="#">Hair Care</a></li>
                        <li><a href="#">Oral Care</a></li>
                        <li><a href="#">Skin Care</a></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="font-bold mb-4">Join the Family</h4>
                    <p className="text-sm mb-2">Get Exclusive offers in your Inbox</p>
                    <div className="flex gap-2">
                        <Input placeholder="Email address" className="rounded" />
                        <Button type="primary" className="bg-[#3c862d] border-none">
                            Sign up
                        </Button>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="max-w-7xl mx-auto mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
                {/* INR Dropdown */}
                <Select
                    defaultValue="inr"
                    className="w-[140px]"
                    suffixIcon={<DownOutlined />}
                    options={[
                        {
                            value: "inr",
                            label: (
                                <span className="flex items-center gap-2">
                                    🇮🇳 INR
                                </span>
                            ),
                        },
                        {
                            value: "usd",
                            label: (
                                <span className="flex items-center gap-2">
                                    🇺🇸 USD
                                </span>
                            ),
                        },
                    ]}
                />

                {/* Footer Links */}
                <div className="text-center space-x-4">
                    <a href="#">Search</a>
                    <a href="#">Privacy policy</a>
                    <a href="#">Shipping policy</a>
                    <a href="#">Returns Policy</a>
                    <a href="#">Terms of service</a>
                </div>

                {/* Copyright */}
                <div className="text-center text-gray-500">
                    Copyright © 2025 Ancient Living.in<br />
                    Powered by Shopify
                </div>
            </div>


        </footer>
    )
}
