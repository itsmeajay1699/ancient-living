"use client"

import { useParams } from 'next/navigation';
import OrderSuccess from '@/app/components/OrderSuccess';

export default function OrderConfirmedPage() {
    const { id } = useParams();
    const orderId = Array.isArray(id) ? id[0] : id;

    if (!orderId) {
        return (
            <div className="flex justify-center items-center h-96">
                <p>No order ID found. Please check your confirmation email.</p>
            </div>
        );
    }

    return <OrderSuccess orderId={orderId} />;
}
