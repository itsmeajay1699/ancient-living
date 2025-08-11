"use client";

import { useEffect, useState } from "react";
import { Menu, ShoppingCart, User, LogOut } from "lucide-react";
import Link from "next/link";
import { medusa } from "@/lib/medusa";
import CategoryMenu from "./CategoryMenu";
import MaxContainer from "./MaxContainer";
import { useCart } from "@/context/CartContext";

interface Customer {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
}

export default function Header() {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch current session
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const { customer } = await medusa.auth.getSession();
                setCustomer(customer);
            } catch {
                setCustomer(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCustomer();
    }, []);

    // ✅ Attach local cart to the logged-in customer so cart persists after login
    useEffect(() => {
        const attachLocalCartToCustomer = async () => {
            if (!customer?.email) return;
            const cartId = typeof window !== "undefined" ? localStorage.getItem("cart_id") : null;
            if (!cartId) return;
            try {
                await medusa.carts.update(cartId, { email: customer.email });
            } catch {
                // ignore
            }
        };
        attachLocalCartToCustomer();
    }, [customer]);

    const handleLogout = async () => {
        try {
            await medusa.auth.deleteSession();
            setCustomer(null);
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const toggleMobileMenu = () => setShowMobileMenu((prev) => !prev);

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <MaxContainer>
                {/* Main Header */}
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
                            Ancient Living
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <UserSection customer={customer} isLoading={isLoading} onLogout={handleLogout} />
                        <CartIcon />
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Desktop Category Menu */}
                <div className="hidden md:block border-t border-gray-100">
                    <CategoryMenu />
                </div>
            </MaxContainer>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <MaxContainer>
                        <div className="py-4 space-y-4">
                            <MobileUserSection customer={customer} isLoading={isLoading} onLogout={handleLogout} />
                            {/* Mobile cart shortcut */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Your cart</span>
                                <CartIcon />
                            </div>
                            <CategoryMenu />
                        </div>
                    </MaxContainer>
                </div>
            )}
        </header>
    );
}

// User Section Component for Desktop
function UserSection({
    customer,
    isLoading,
    onLogout,
}: {
    customer: Customer | null;
    isLoading: boolean;
    onLogout: () => void;
}) {
    if (isLoading) {
        return <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />;
    }

    if (customer) {
        return (
            <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <div className="text-sm">
                        <p className="font-medium text-gray-900">{customer.first_name || customer.email}</p>
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

// User Section Component for Mobile
function MobileUserSection({
    customer,
    isLoading,
    onLogout,
}: {
    customer: Customer | null;
    isLoading: boolean;
    onLogout: () => void;
}) {
    if (isLoading) return null;

    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
            {customer ? (
                <>
                    <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{customer.first_name || customer.email}</span>
                    </div>
                    <button onClick={onLogout} className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </>
            ) : (
                <Link href="/login" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                    <User className="w-5 h-5" />
                    <span>Login</span>
                </Link>
            )}
        </div>
    );
}

// Cart Icon Component with live badge
function CartIcon() {
    const { cart, loading } = useCart();

    const count =
        cart?.items?.reduce((sum, item) => sum + (typeof item.quantity === "number" ? item.quantity : 0), 0) ?? 0;

    return (
        <Link
            href="/cart" // go straight to checkout; change to "/cart" if you add a cart page
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Shopping cart"
        >
            <ShoppingCart className="w-6 h-6 text-gray-600" />
            {/* badge */}
            {!loading && count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                    {count}
                </span>
            )}
            {loading && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gray-200 animate-pulse" />}
        </Link>
    );
}
