"use client";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { animate } from "framer-motion";
import { cn } from "@/lib/utils";

export function SpotlightNavbar({
    items = [
        { label: "Home", href: "/" },
        { label: "Gallery", href: "/#gallery" },
        { label: "About", href: "/about" },
    ],
    className,
    onItemClick,
}) {
    const navRef = useRef(null);
    const location = useLocation();

    // Determine active index based on route
    const getActiveIndex = () => {
        const hash = location.hash;
        const pathname = location.pathname;

        const index = items.findIndex((item) => {
            if (item.href === '/') {
                return pathname === '/' && !hash;
            }
            if (item.href.includes('#')) {
                const [path, itemHash] = item.href.split('#');
                return pathname === path && hash === `#${itemHash}`;
            }
            return pathname === item.href;
        });

        return index !== -1 ? index : 0;
    };

    const activeIndex = getActiveIndex();
    const [hoverX, setHoverX] = useState(null);
    const [isDark, setIsDark] = useState(false);

    // Refs for the "light" positions so we can animate them imperatively
    const spotlightX = useRef(0);
    const ambienceX = useRef(0);

    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!navRef.current) return;
        const nav = navRef.current;

        const handleMouseMove = (e) => {
            const rect = nav.getBoundingClientRect();
            const x = e.clientX - rect.left;
            setHoverX(x);
            // Direct update for immediate feedback (no spring for the mouse itself, feels snappier)
            spotlightX.current = x;
            nav.style.setProperty("--spotlight-x", `${x}px`);
        };

        const handleMouseLeave = () => {
            setHoverX(null);
            // When mouse leaves, spring the spotlight back to the active item
            const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
            if (activeItem) {
                const navRect = nav.getBoundingClientRect();
                const itemRect = activeItem.getBoundingClientRect();
                const targetX = itemRect.left - navRect.left + itemRect.width / 2;

                animate(spotlightX.current, targetX, {
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    onUpdate: (v) => {
                        spotlightX.current = v;
                        nav.style.setProperty("--spotlight-x", `${v}px`);
                    }
                });
            }
        };

        nav.addEventListener("mousemove", handleMouseMove);
        nav.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            nav.removeEventListener("mousemove", handleMouseMove);
            nav.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [activeIndex]);

    // Handle the "Ambience" (Active Item) Movement
    useEffect(() => {
        if (!navRef.current) return;
        const nav = navRef.current;
        const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

        if (activeItem) {
            const navRect = nav.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();
            const targetX = itemRect.left - navRect.left + itemRect.width / 2;

            animate(ambienceX.current, targetX, {
                type: "spring",
                stiffness: 200,
                damping: 20,
                onUpdate: (v) => {
                    ambienceX.current = v;
                    nav.style.setProperty("--ambience-x", `${v}px`);
                },
            });
        }
    }, [activeIndex]);

    const handleItemClick = (item, index) => {
        onItemClick?.(item, index);
    };

    return (
        <div className={cn("relative flex justify-center", className)}>
            <nav
                ref={navRef}
                className={cn(
                    "relative h-11 rounded-full transition-all duration-300 overflow-hidden flex items-center"
                )}
                style={{
                    '--spotlight-color': isDark ? 'rgba(255,168,0,0.15)' : 'rgba(255,122,0,0.08)',
                    '--ambience-color': isDark ? 'rgba(255,168,0,1)' : 'rgba(255,122,0,0.8)',
                }}
            >
                {/* Content */}
                <ul className="relative flex items-center h-full px-2 gap-0 z-[10]">
                    {items.map((item, idx) => (
                        <li key={idx} className="relative h-full flex items-center justify-center">
                            <Link
                                to={item.href}
                                data-index={idx}
                                onClick={() => handleItemClick(item, idx)}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full select-none",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/30",
                                    // Active vs Inactive Text
                                    activeIndex === idx
                                        ? "text-black dark:text-white"
                                        : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                                )}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* LIGHTING LAYERS */}
                {/* 1. The Moving Spotlight (Follows Mouse) */}
                <div
                    className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] opacity-0 transition-opacity duration-300"
                    style={{
                        opacity: hoverX !== null ? 1 : 0,
                        background: `
                            radial-gradient(
                                120px circle at var(--spotlight-x) 100%, 
                                var(--spotlight-color) 0%, 
                                transparent 50%
                            )
                        `
                    }}
                />

                {/* 2. The Active State Ambience (Stays on Active) */}
                <div
                    className="pointer-events-none absolute bottom-0 left-0 w-full h-[2px] z-[2]"
                    style={{
                        background: `
                            radial-gradient(
                                60px circle at var(--ambience-x) 0%, 
                                var(--ambience-color) 0%, 
                                transparent 100%
                            )
                        `
                    }}
                />
            </nav>
        </div>
    );
}
