"use client";

import { useEffect, useState } from "react";
import { Menu, ShoppingCart, User, LogOut } from "lucide-react";
import Link from "next/link";
import { medusa, sdk } from "@/lib/medusa";
import CategoryMenu from "./CategoryMenu";
import MaxContainer from "./MaxContainer";
import { useCart } from "@/context/CartContext";

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

    // Check localStorage on every render if customer is null (simple fallback)
    useEffect(() => {
        if (!customer && !isLoading) {
            const storedCustomer = localStorage.getItem("customer");
            if (storedCustomer) {
                try {
                    setCustomer(JSON.parse(storedCustomer));
                } catch {
                    localStorage.removeItem("customer");
                }
            }
        }
    }, [customer, isLoading]);

    // Fetch current session
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                // First try to get from SDK
                const { customer } = await sdk.store.customer.retrieve();
                setCustomer(customer || null);

                // If successful, update localStorage
                if (customer) {
                    localStorage.setItem("customer", JSON.stringify(customer));
                }
            } catch {
                // If SDK fails, try localStorage as fallback
                const storedCustomer = localStorage.getItem("customer");
                if (storedCustomer) {
                    try {
                        setCustomer(JSON.parse(storedCustomer));
                    } catch {
                        localStorage.removeItem("customer");
                        setCustomer(null);
                    }
                } else {
                    setCustomer(null);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchCustomer();
    }, []);

    // Listen for storage changes (when user logs in/out in another tab or component)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "customer") {
                if (e.newValue) {
                    try {
                        setCustomer(JSON.parse(e.newValue));
                    } catch {
                        setCustomer(null);
                    }
                } else {
                    setCustomer(null);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Listen for custom login events
    useEffect(() => {
        const handleCustomerLogin = (e: CustomEvent) => {
            setCustomer(e.detail.customer);
        };

        const handleCustomerLogout = () => {
            setCustomer(null);
        };

        window.addEventListener('customerLogin', handleCustomerLogin as EventListener);
        window.addEventListener('customerLogout', handleCustomerLogout);

        return () => {
            window.removeEventListener('customerLogin', handleCustomerLogin as EventListener);
            window.removeEventListener('customerLogout', handleCustomerLogout);
        };
    }, []);

    // ✅ Attach local cart to the logged-in customer so cart persists after login
    useEffect(() => {
        const attachLocalCartToCustomer = async () => {
            if (!customer?.email) return;
            try {
                await associateWithCustomer(customer.email);
                console.log("Cart attached to customer from header");
            } catch (error) {
                console.error("Failed to attach cart to customer:", error);
            }
        };
        attachLocalCartToCustomer();
    }, [customer, associateWithCustomer]);

    const handleLogout = async () => {
        try {
            await sdk.auth.logout();
            setCustomer(null);
            localStorage.removeItem("customer");

            // Remove customer email from cart but keep the cart and items
            const cartId = localStorage.getItem("cart_id");
            if (cartId) {
                try {
                    await medusa.carts.update(cartId, { email: null });
                    console.log("Removed customer association from cart");
                } catch (cartError) {
                    console.log("Could not remove customer from cart:", cartError);
                }
            }

            // Trigger custom event
            window.dispatchEvent(new CustomEvent('customerLogout'));

            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const toggleMobileMenu = () => setShowMobileMenu((prev) => !prev);

    return (
        <>
            {/* Main Header - Scrollable */}
            <header className="bg-white shadow-sm border-b border-[#C65242]">
                <MaxContainer>
                    <div className="flex items-center justify-between py-4 ">
                        {/* Logo */}
                        <Link href="/" className="flex items-center">
                            <img
                                className="h-[57px] w-[171px] object-contain"
                                src="https://botanicalbloom.in/images/logo.png" alt="" />
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

            {/* Sticky Category Menu - Desktop only */}
            <div className="hidden md:block sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <MaxContainer>
                    <CategoryMenu />
                </MaxContainer>
            </div>
        </>
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
