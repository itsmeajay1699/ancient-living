'use client';

import React from 'react';
import { Carousel } from 'antd';
import Image from 'next/image';
import Link from 'next/link';

interface CarouselItem {
    id: number;
    image: string;
    alt: string;
    link: string;
    title: string;
}

const carouselItems: CarouselItem[] = [
    {
        id: 1,
        image: '/images/skin-care.webp',
        alt: 'Skin Care Products',
        link: '/collections/skin-care',
        title: 'Skin Care Collection'
    },
    {
        id: 2,
        image: '/images/healthy-care.webp',
        alt: 'Healthy Care Products',
        link: '/collections/healthy-care',
        title: 'Healthy Care Collection'
    }
];

const HeroBanner: React.FC = () => (
    <Carousel
        draggable={true}
        autoplay={{ dotDuration: true }} autoplaySpeed={2000}
    >
        {carouselItems.map((item) => (
            <div key={item.id} className="carousel-slide">
                <Link href={item.link} className="block relative">
                    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.alt}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            priority={item.id === 1}
                        />
                    </div>
                </Link>
            </div>
        ))}
    </Carousel>
);

export default HeroBanner;