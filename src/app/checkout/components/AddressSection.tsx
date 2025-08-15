/**
 * Address Management Component
 * Handles customer address selection and new address form
 */

import React from 'react';
import { Address } from '../types/index';

interface AddressSectionProps {
    addresses: Address[];
    selectedAddressId: string | "new";
    setSelectedAddressId: (id: string | "new") => void;
    addressForm: Address;
    setAddressForm: (address: Address) => void;
    saveToAccount: boolean;
    setSaveToAccount: (save: boolean) => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({
    addresses,
    selectedAddressId,
    setSelectedAddressId,
    addressForm,
    setAddressForm,
    saveToAccount,
    setSaveToAccount,
}) => {
    const updateAddressField = (field: keyof Address, value: string) => {
        setAddressForm({ ...addressForm, [field]: value });
    };

    return (
        <section className="border rounded-lg p-4 bg-white">
            <h2 className="text-lg font-semibold mb-3">Delivery</h2>

            {/* Existing Addresses */}
            {addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                    {addresses.map((address) => (
                        <label
                            key={address.id}
                            className="flex items-start gap-3 border rounded p-3 cursor-pointer hover:bg-gray-50"
                        >
                            <input
                                type="radio"
                                name="address"
                                checked={selectedAddressId === address.id}
                                onChange={() => setSelectedAddressId(address.id!)}
                                className="mt-1 text-green-600"
                            />
                            <div className="text-sm">
                                <div className="font-medium">
                                    {address.first_name} {address.last_name}
                                </div>
                                <div className="text-gray-600">
                                    {address.address_1}
                                    {address.address_2 ? `, ${address.address_2}` : ""}, {address.city}
                                    {address.province ? `, ${address.province}` : ""} {address.postal_code}
                                </div>
                                <div className="text-gray-600 uppercase">
                                    Country: {address.country_code}
                                </div>
                                {address.phone && (
                                    <div className="text-gray-600">Phone: {address.phone}</div>
                                )}
                            </div>
                        </label>
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === "new"}
                            onChange={() => setSelectedAddressId("new")}
                            className="text-green-600"
                        />
                        <span className="text-sm">Use a different address</span>
                    </label>
                </div>
            )}

            {/* New Address Form */}
            {selectedAddressId === "new" && (
                <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium mb-1">
                            First name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={addressForm.first_name}
                            onChange={(e) => updateAddressField('first_name', e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-sm font-medium mb-1">Last name</label>
                        <input
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={addressForm.last_name || ""}
                            onChange={(e) => updateAddressField('last_name', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Address line 1"
                            value={addressForm.address_1}
                            onChange={(e) => updateAddressField('address_1', e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <input
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            placeholder="Apartment, suite, etc. (optional)"
                            value={addressForm.address_2 || ""}
                            onChange={(e) => updateAddressField('address_2', e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={addressForm.city}
                            onChange={(e) => updateAddressField('city', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">State</label>
                        <input
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={addressForm.province || ""}
                            onChange={(e) => updateAddressField('province', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">PIN code</label>
                        <input
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={addressForm.postal_code || ""}
                            onChange={(e) => updateAddressField('postal_code', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input
                            type="tel"
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={addressForm.phone || ""}
                            onChange={(e) => updateAddressField('phone', e.target.value)}
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Country/Region</label>
                        <select
                            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            value={addressForm.country_code}
                            onChange={(e) => updateAddressField('country_code', e.target.value.toLowerCase())}
                        >
                            <option value="in">India</option>
                            {/* Add more countries as needed */}
                        </select>
                    </div>

                    <label className="col-span-2 flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={saveToAccount}
                            onChange={(e) => setSaveToAccount(e.target.checked)}
                            className="rounded text-green-600 focus:ring-green-500"
                        />
                        Save this address to my account
                    </label>
                </div>
            )}
        </section>
    );
};

export default AddressSection;
