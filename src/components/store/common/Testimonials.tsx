"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Quote, User } from "lucide-react";
import type { TestimonialsContent, GlobalStyles, TypographySettings, SpacingSettings } from "@/types";

interface TestimonialsProps {
    content: TestimonialsContent;
    styles: GlobalStyles;
}

export function Testimonials({ content, styles }: TestimonialsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { colors, typography, spacing } = styles;

    if (!content.visible || content.items.length === 0) {
        return null;
    }

    const sectionPaddingClass = {
        compact: "py-12 md:py-16",
        normal: "py-16 md:py-24",
        spacious: "py-24 md:py-32",
    }[spacing.sectionPadding];

    const headingSizeClass = {
        small: "text-2xl md:text-3xl",
        medium: "text-3xl md:text-4xl",
        large: "text-4xl md:text-5xl",
        xlarge: "text-5xl md:text-6xl",
    }[typography.headingSize];

    const transformClass =
        typography.headingTransform === "uppercase"
            ? "uppercase"
            : typography.headingTransform === "capitalize"
                ? "capitalize"
                : "";

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % content.items.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + content.items.length) % content.items.length);
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                    />
                ))}
            </div>
        );
    };

    const TestimonialCard = ({ testimonial, index }: { testimonial: typeof content.items[0]; index: number }) => (
        <div
            key={testimonial.id}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 transition-all duration-300 hover:scale-[1.02]"
            style={{
                backgroundColor: `${colors.text}08`,
                border: `1px solid ${colors.text}15`,
            }}
        >
            <Quote className="h-8 w-8 mb-4 opacity-20" style={{ color: colors.primary }} />

            <p
                className="text-base md:text-lg leading-relaxed mb-6"
                style={{ color: colors.text, opacity: 0.9 }}
            >
                "{testimonial.text}"
            </p>

            <div className="flex items-center gap-4">
                {content.showAvatar && (
                    <div
                        className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: `${colors.primary}20` }}
                    >
                        {testimonial.imageUrl ? (
                            <Image
                                src={testimonial.imageUrl}
                                alt={testimonial.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User className="h-6 w-6" style={{ color: colors.primary }} />
                            </div>
                        )}
                    </div>
                )}
                <div className="flex-1">
                    <p className="font-semibold" style={{ color: colors.text }}>
                        {testimonial.name}
                    </p>
                    {content.showRating && renderStars(testimonial.rating)}
                </div>
            </div>
        </div>
    );

    return (
        <section
            className={sectionPaddingClass}
            style={{ backgroundColor: colors.background }}
        >
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2
                        className={`font-bold mb-3 ${headingSizeClass} ${transformClass}`}
                        style={{ color: colors.text }}
                    >
                        {content.title}
                    </h2>
                    {content.subtitle && (
                        <p
                            className="text-lg opacity-70 max-w-2xl mx-auto"
                            style={{ color: colors.text }}
                        >
                            {content.subtitle}
                        </p>
                    )}
                </div>

                {/* Content */}
                {content.layout === "carousel" ? (
                    <div className="relative">
                        {/* Carousel */}
                        <div className="overflow-hidden">
                            <div
                                className="transition-transform duration-500 ease-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                <div className="flex">
                                    {content.items.map((testimonial, index) => (
                                        <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                                            <div className="max-w-2xl mx-auto">
                                                <TestimonialCard testimonial={testimonial} index={index} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        {content.items.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                                    style={{ border: `1px solid ${colors.text}20` }}
                                >
                                    <ChevronLeft className="h-5 w-5" style={{ color: colors.text }} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                                    style={{ border: `1px solid ${colors.text}20` }}
                                >
                                    <ChevronRight className="h-5 w-5" style={{ color: colors.text }} />
                                </button>

                                {/* Dots */}
                                <div className="flex justify-center gap-2 mt-6">
                                    {content.items.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "w-6" : ""
                                                }`}
                                            style={{
                                                backgroundColor: index === currentIndex ? colors.primary : `${colors.text}30`,
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    /* Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {content.items.map((testimonial, index) => (
                            <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
