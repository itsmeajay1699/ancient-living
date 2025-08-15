"use client";

import { useEffect, useState } from "react";
import { Menu, ShoppingCart, User, LogOut } from "lucide-react";
import Link from "next/link";
import { medusa, sdk } from "@/lib/medusa";
import MaxContainer from "./MaxContainer";
import { useCart } from "@/context/CartContext";
import AnnouncementStrip from "@/components/AnnouncementStrip";

interface Customer {
    id: string;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
}

export default function Header() {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { associateWithCustomer } = useCart();

    // Initialize customer from session and localStorage
    useEffect(() => {
        const initializeCustomer = async () => {
            try {
                const { customer } = await sdk.store.customer.retrieve();
                if (customer) {
                    setCustomer(customer);
                    localStorage.setItem("customer", JSON.stringify(customer));
                } else {
                    // Fallback to localStorage
                    const storedCustomer = localStorage.getItem("customer");
                    if (storedCustomer) {
                        setCustomer(JSON.parse(storedCustomer));
                    }
                }
            } catch {
                // Fallback to localStorage on error
                const storedCustomer = localStorage.getItem("customer");
                if (storedCustomer) {
                    try {
                        setCustomer(JSON.parse(storedCustomer));
                    } catch {
                        localStorage.removeItem("customer");
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        initializeCustomer();
    }, []);

    // Listen for storage changes and custom events
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "customer") {
                setCustomer(e.newValue ? JSON.parse(e.newValue) : null);
            }
        };

        const handleCustomerLogin = (e: CustomEvent) => setCustomer(e.detail.customer);
        const handleCustomerLogout = () => setCustomer(null);

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener('customerLogin', handleCustomerLogin as EventListener);
        window.addEventListener('customerLogout', handleCustomerLogout);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener('customerLogin', handleCustomerLogin as EventListener);
            window.removeEventListener('customerLogout', handleCustomerLogout);
        };
    }, []);

    // Associate cart with customer when logged in
    useEffect(() => {
        if (customer?.email) {
            associateWithCustomer(customer.email).catch(console.error);
        }
    }, [customer?.email, associateWithCustomer]);

    const handleLogout = async () => {
        try {
            await sdk.auth.logout();
            setCustomer(null);
            localStorage.removeItem("customer");

            // Remove customer from cart but keep items
            const cartId = localStorage.getItem("cart_id");
            if (cartId) {
                await medusa.carts.update(cartId, { email: null }).catch(console.error);
            }

            window.dispatchEvent(new CustomEvent('customerLogout'));
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <>
            <header className="bg-white shadow-sm border-b border-[#C65242]">
                <MaxContainer>
                    <div className="flex items-center justify-between py-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <img
                                className="h-[57px] w-[171px] object-contain"
                                src="https://botanicalbloom.in/images/logo.png"
                                alt="Ancient Living Logo"
                            />
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <UserSection customer={customer} isLoading={isLoading} onLogout={handleLogout} />
                            <CartIcon />
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </MaxContainer>

                {/* Mobile Menu */}
                {showMobileMenu && (
                    <div className="md:hidden border-t border-gray-100 bg-white">
                        <MaxContainer>
                            <div className="py-4 space-y-4">
                                <UserSection
                                    customer={customer}
                                    isLoading={isLoading}
                                    onLogout={handleLogout}
                                    isMobile
                                />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Your cart</span>
                                    <CartIcon />
                                </div>
                            </div>
                        </MaxContainer>
                    </div>
                )}
            </header>

            {/* Announcement Strip */}
            <div className="sticky top-0 z-50 bg-white">
                <AnnouncementStrip
                    announcements={["7 Day Delivery", "Free Shipping", "100% Indian Human Hair"]}
                    speed="medium"
                    direction="left"
                    backgroundColor="#F8F3EE"
                    textColor="text-black"
                    pauseOnHover={true}
                    separator="•"
                />
            </div>
        </>
    );
}

// Unified User Section Component
function UserSection({
    customer,
    isLoading,
    onLogout,
    isMobile = false,
}: {
    customer: Customer | null;
    isLoading: boolean;
    onLogout: () => void;
    isMobile?: boolean;
}) {
    if (isLoading) {
        return <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />;
    }

    const containerClass = isMobile
        ? "flex items-center justify-between py-2 border-b border-gray-100"
        : "flex items-center space-x-3";

    if (customer) {
        return (
            <div className={containerClass}>
                <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <div className="text-sm">
                        <p className="font-medium text-gray-900">
                            {customer.first_name || customer.email}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>
        );
    }

    return (
        <Link
            href="/login"
            className="flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
            <User className="w-5 h-5" />
            <span>Login</span>
        </Link>
    );
}

// Cart Icon Component
function CartIcon() {
    const { cart, loading } = useCart();

    const itemCount = cart?.items?.reduce(
        (sum, item) => sum + (item.quantity || 0), 0
    ) || 0;

    return (
        <Link
            href="/cart"
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Shopping cart"
        >
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            {!loading && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                    {itemCount}
                </span>
            )}
            {loading && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
            )}
        </Link>
    );
}
