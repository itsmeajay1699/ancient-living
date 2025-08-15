/**
 * Contact Information Component
 * Handles customer email input
 */

import React from 'react';

interface ContactSectionProps {
    email: string;
    setEmail: (email: string) => void;
}

const ContactSection: React.FC<ContactSectionProps> = ({ email, setEmail }) => {
    return (
        <section className="border rounded-lg p-4 bg-white">
            <h2 className="text-lg font-semibold mb-3">Contact</h2>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
                type="email"
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <p className="mt-2 text-xs text-gray-500">
                We'll send your order confirmation here.
            </p>
        </section>
    );
};

export default ContactSection;
