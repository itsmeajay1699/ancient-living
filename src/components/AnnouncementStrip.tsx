/**
 * AnnouncementStrip Component
 * A scrolling marquee with customizable announcements
 */

import React from 'react';

interface AnnouncementStripProps {
    announcements?: string[];
    speed?: 'slow' | 'medium' | 'fast';
    direction?: 'left' | 'right';
    backgroundColor?: string;
    textColor?: string;
    pauseOnHover?: boolean;
    separator?: string;
    className?: string;
}

const AnnouncementStrip: React.FC<AnnouncementStripProps> = ({
    announcements = [
        "7 Day Delivery",
        "Free Shipping",
        "100% Indian Human Hair"
    ],
    speed = 'medium',
    direction = 'left',
    backgroundColor = 'bg-black',
    textColor = 'text-white',
    pauseOnHover = true,
    separator = '•',
    className = ''
}) => {
    // Create enough duplicates for seamless scrolling
    const duplicatedAnnouncements = Array(5).fill(announcements).flat();

    return (
        <div className={`overflow-hidden ${backgroundColor} ${textColor} py-2 relative ${className}`}>
            <div
                className={`flex whitespace-nowrap animate-scroll-${direction} animate-scroll-${speed} ${pauseOnHover ? 'hover:pause' : ''}`}
                role="region"
                aria-label="Announcements"
                style={{
                    animationTimingFunction: 'linear',
                    animationIterationCount: 'infinite'
                }}
            >
                {duplicatedAnnouncements.map((announcement, index) => (
                    <React.Fragment key={index}>
                        <div
                            className="flex-shrink-0 px-4 text-sm font-medium flex items-center"
                            role="region"
                            aria-label="Announcement"
                        >
                            {announcement}
                        </div>
                        {index < duplicatedAnnouncements.length - 1 && (
                            <div className="flex-shrink-0 px-4 text-sm opacity-50">
                                {separator}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

// Export a preset component for the exact use case
export const HairProductAnnouncementStrip: React.FC<{ className?: string }> = ({ className }) => (
    <AnnouncementStrip
        announcements={[
            "7 Day Delivery",
            "Free Shipping",
            "100% Indian Human Hair"
        ]}
        speed="medium"
        direction="left"
        backgroundColor="bg-amber-600"
        textColor="text-white"
        pauseOnHover={true}
        className={className}
    />
);

export default AnnouncementStrip;
