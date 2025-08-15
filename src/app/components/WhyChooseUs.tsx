import React from 'react';
import { FaLeaf, FaHeart, FaHandHoldingHeart, FaGlobeAmericas } from 'react-icons/fa';

const features = [
    {
        icon: <FaLeaf className="w-8 h-8 text-[#C75545]" />,
        title: 'Pure & Natural',
        description: 'We use only the finest natural ingredients, sourced ethically and sustainably.',
    },
    {
        icon: <FaHeart className="w-8 h-8 text-[#C75545]" />,
        title: 'Cruelty-Free',
        description: 'Our products are never tested on animals, ensuring kindness in every step.',
    },
    {
        icon: <FaHandHoldingHeart className="w-8 h-8 text-[#C75545]" />,
        title: 'Handcrafted with Care',
        description: 'Each item is handcrafted in small batches to guarantee quality and freshness.',
    },
    {
        icon: <FaGlobeAmericas className="w-8 h-8 text-[#C75545]" />,
        title: 'Eco-Friendly',
        description: 'We are committed to sustainable practices and eco-friendly packaging.',
    },
];

const WhyChooseUs = () => {
    return (
        <section className="bg-stone-50 py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-light text-gray-800 tracking-wide">
                        Why <span className="font-serif font-medium text-[#C75545]">Choose Us</span>
                    </h2>
                    <div className="w-20 h-0.5 bg-gradient-to-r from-[#C75545] to-[#D17B6F] mx-auto mt-6"></div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {features.map((feature, index) => (
                        <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <div className="flex justify-center items-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">{feature.title}</h3>
                            <p className="text-gray-600 font-light leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
