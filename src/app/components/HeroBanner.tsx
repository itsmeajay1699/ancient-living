"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animation variants for the container to orchestrate children animations
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15, // Stagger the animation of children
            delayChildren: 0.1,   // Wait a bit before starting
        },
    },
};

// Animation variants for each word in the headline
const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            stiffness: 100,
            damping: 10,
        },
    },
};

// Animation for the paragraph and buttons
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};


const HeroBanner: React.FC = () => {
    const headline = "The Essence of Purity";
    const words = headline.split(" ");

    return (
        <div className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center text-center bg-black">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                src="https://dgaqwe1r16p4i.cloudfront.net/presale/botanical_output.mp4"
            >
                Your browser does not support the video tag.
            </video>

            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10"></div>

            {/* Content */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-20 text-white px-6 flex flex-col items-center"
            >
                <motion.h1
                    className="text-5xl md:text-8xl font-serif text-stone-100 mb-6"
                    aria-label={headline}
                >
                    {words.map((word, index) => (
                        <motion.span
                            key={index}
                            variants={wordVariants}
                            className="inline-block mr-4" // Added margin for spacing
                        >
                            {word}
                        </motion.span>
                    ))}
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl max-w-3xl mx-auto text-stone-300 font-medium mb-12"
                >
                    Experience the timeless wisdom of nature with our authentic, handcrafted wellness products.
                </motion.p>

                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row items-center gap-6"
                >
                    <motion.div whileHover={{ y: -4, scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <Link
                            href="#categories"
                            className="font-light text-stone-100 border border-stone-400 rounded-full px-10 py-4 hover:bg-white/10 transition-colors duration-300 text-lg"
                        >
                            Explore Categories
                        </Link>
                    </motion.div>
                    <motion.div whileHover={{ y: -4, scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                        <Link
                            href="#top-sellers"
                            className="font-light text-stone-100 bg-[#C75545]/80 border border-transparent rounded-full px-10 py-4 hover:bg-[#C75545] transition-colors duration-300 text-lg"
                        >
                            View Top Sellers
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default HeroBanner;