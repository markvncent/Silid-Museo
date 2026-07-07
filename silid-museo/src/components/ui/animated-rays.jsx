"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function AnimatedRays({
    className = "",
    children,
    headline,
    subtext
}) {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsDark(true);
    }, []);

    if (!mounted) return null;

    const stripes = `repeating-linear-gradient(
        100deg,
        var(--stripe-color) 0%,
        var(--stripe-color) 7%,
        transparent 10%,
        transparent 12%,
        var(--stripe-color) 16%
    )`;
    const rainbow = `repeating-linear-gradient(
        100deg,
        #ffb800 10%,
        #ff7a00 15%,
        #ffdb6a 20%,
        #ffd54f 25%,
        #ffb800 30%
    )`;

    return (
        <section
            className={cn("relative w-full h-[400px] overflow-hidden rounded-2xl border border-theme-subtle", className)}
            style={{
                // Solid base so mask fade-out reveals THIS, not the page bg
                backgroundColor: "#1a1208",
            }}
        >
            {/* Aurora Background — matches original .hero */}
            <div
                className="absolute inset-0"
                style={{
                    "--stripe-color": "#fff8ec",
                    backgroundImage: `${stripes}, ${rainbow}`,
                    backgroundSize: "300%, 200%",
                    backgroundPosition: "50% 50%, 50% 50%",
                    backgroundColor: "#1a1208",
                    filter: isDark
                        ? "blur(10px) opacity(50%) saturate(200%)"
                        : "blur(10px) invert(100%)",
                    maskImage: "radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 100% 0%, black 40%, transparent 70%)",
                }}>
                {/* Animated overlay — matches original .hero::after */}
                <div
                    className="absolute inset-0 animate-aurora-bg"
                    style={{
                        "--stripe-color": "#fff8ec",
                        backgroundImage: `${stripes}, ${rainbow}`,
                        backgroundSize: "200%, 100%",
                        backgroundAttachment: "fixed",
                        mixBlendMode: "multiply",
                    }} />
            </div>
            {(children || headline || subtext) && (
                <div
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                    {children ? children : (
                        <div className="max-w-2xl px-4">
                            {headline && (
                                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-heading drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] mb-3">
                                    {headline}
                                </h3>
                            )}
                            {subtext && (
                                <p className="text-sm sm:text-base md:text-lg text-white/80 font-sans max-w-xl mx-auto drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
                                    {subtext}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default AnimatedRays;