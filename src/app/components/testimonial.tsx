"use client";

import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import MaxContainer from "./MaxContainer";

const testimonials = [
    {
        content: "Nice oil for massaging and after applying it on skin there's no need of using moisturizing cream.",
        author: "SD",
        rating: 5,
    },
    {
        content: "Absolutely love the fragrance and quality of this product.",
        author: "RK",
        rating: 5,
    },
    {
        content: "Great for daily skin care. Keeps skin soft and fresh.",
        author: "NM",
        rating: 5,
    },
    {
        content: "Natural and non-sticky oil, very relaxing.",
        author: "AK",
        rating: 5,
    },
    {
        content: "Love how it hydrates without any chemicals!",
        author: "Misha",
        rating: 5,
    },
];

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 1,
    },
    tablet: {
        breakpoint: { max: 1024, min: 768 },
        items: 2,
        slidesToSlide: 1,
    },
    mobile: {
        breakpoint: { max: 768, min: 0 },
        items: 1,
        slidesToSlide: 1,
    },
};

const CustomLeftArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
        onClick={onClick}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-shadow"
        aria-label="Previous testimonial"
    >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
    </button>
);

const CustomRightArrow = ({ onClick }: { onClick?: () => void }) => (
    <button
        onClick={onClick}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-shadow"
        aria-label="Next testimonial"
    >
        <ChevronRight className="w-5 h-5 text-gray-600" />
    </button>
);

export default function TestimonialCarousel() {
    return (
        <section className="py-16 bg-gray-50">
            <MaxContainer>
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        What Our Customers Say
                    </h2>
                    <p className="text-gray-600">Real reviews from real customers</p>
                </div>

                <Carousel
                    responsive={responsive}
                    infinite
                    swipeable
                    draggable
                    showDots
                    arrows
                    autoPlay
                    autoPlaySpeed={4000}
                    keyBoardControl
                    customTransition="transform 300ms ease-in-out"
                    transitionDuration={300}
                    removeArrowOnDeviceType={["mobile"]}
                    customLeftArrow={<CustomLeftArrow />}
                    customRightArrow={<CustomRightArrow />}
                    itemClass="px-3"
                >
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="h-full">
                            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 h-full">
                                <div className="flex justify-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < testimonial.rating
                                                ? "text-yellow-400 fill-current"
                                                : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>

                                <blockquote className="text-gray-700 text-center leading-relaxed mb-6 text-sm">
                                    "{testimonial.content}"
                                </blockquote>

                                <div className="text-center">
                                    <p className="font-semibold text-gray-900">
                                        {testimonial.author}
                                    </p>
                                    <p className="text-xs text-gray-500">Verified Customer</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </MaxContainer>
        </section>
    );
}
