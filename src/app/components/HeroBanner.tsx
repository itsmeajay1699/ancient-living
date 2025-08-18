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
        image: '/images/heal.webp',
        alt: 'Healthy Care Products',
        link: '/collections/healthy-care',
        title: 'Healthy Care Collection'
    }
];

const HeroBanner: React.FC = () => (
    <div className="relative h-[400px] md:h-[500px] lg:h-[60dvh] w-full overflow-hidden">
        <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-fill"
            src="https://dgaqwe1r16p4i.cloudfront.net/presale/botanical_output.mp4"
        >
            Your browser does not support the video tag.
        </video>
    </div>
);

export default HeroBanner;