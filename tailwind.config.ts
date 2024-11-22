import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import ratio from "@tailwindcss/aspect-ratio";
import colors from "tailwindcss/colors";

export default {
    content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx,md,mdx}"],
    darkMode: "class",
    safelist: [
        'animate-fade-in-up',
        'animate-fade-out-up',
        'animate-fade-in-down',
        'animate-fade-out-down',
        'animate-fade-in-left',
        'animate-fade-out-left',
        'animate-fade-in-right',
        'animate-fade-out-right',
    ],
    theme: {
        extend: {
            transitionProperty: {
                opacity: "opacity",
            },
            boxShadow: {
                "custom-ring": "0 0 10px rgba(0, 0, 255, 0.5)",
                mirror: "0 8px 32px rgba(0, 0, 0, 0.25)",
            },
            dropShadow: {
                "bright-glow": "0 0 4em rgba(255, 255, 255, 0.9)",
                "blue-glow": "0 0 4em rgba(0, 123, 255, 0.9)",
            },
            colors: {
                primary: '#1DA1F2',
                secondary: '#14171A',
                focusOutline: "#1E90FF",
                mirrorEffect: "#9ca3af",
                cardBgLight: "#F9FAFB",
                cardBgDark: "#1F2937",
                controlBorderColorSelected: "#0d1117",
                menuBgColorActive: "#151b23",
                outlineFocusOffset: "-0.125rem",
                outlineFocusWidth: "0.125rem",
                color: "#C8FF80",
                "dark-blue-black-01": "rgba(4, 9, 20, 0.9)",
                "dark-blue-black-02": "rgba(12, 27, 52, 0.8)",
                "dark-blue-black-03": "rgba(7, 19, 38, 0.7)",
                "dark-blue-black-04": "rgba(5, 15, 30, 0.6)",
                "dark-blue-black-05": "rgba(3, 11, 25, 0.5)",
                "bright-blue-black": "rgba(50, 50, 80, 0.8)",
                "bluish-black-01": "rgba(10, 10, 20, 0.9)",
                "bluish-black-02": "rgba(10, 20, 30, 0.8)",
                "bluish-black-03": "rgba(20, 30, 40, 0.7)",
                customGray: colors.gray[800],
                customWhite: colors.white,
            },
            transitionTimingFunction: {
                'custom-ease': 'ease',
            },
            transitionDuration: {
                300: '300ms',
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                bounceIn: {
                    "0%": {
                        transform:
                            "translateX(var(--startX)) translateY(var(--startY)) scale(0.8)",
                    },
                    "50%": {
                        transform: "translateX(0) translateY(0) scale(1.1)",
                    },
                    "100%": {
                        transform: "translateX(0) translateY(0) scale(1)",
                    },
                },
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                fadeOut: {
                    "0%": { opacity: "1" },
                    "100%": { opacity: "0" },
                },
                marquee: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
                borderGlowOnce: {
                    "0%": { backgroundPosition: "0% 50%" },
                    "100%": { backgroundPosition: "200% 50%" },
                },
                slideInLeft: {
                    "0%": { opacity: "0", transform: "translateX(-100%)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                slideInRight: {
                    "0%": { opacity: "0", transform: "translateX(100%)" },
                    "100%": { opacity: "1", transform: "translateX(0)" },
                },
                slideInBottom: {
                    "0%": { opacity: "0", transform: "translateY(100%)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },    'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(1rem)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-out-up': {
                    '0%': { opacity: '1', transform: 'translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateY(1rem)' },
                },
                'fade-in-down': {
                    '0%': { opacity: '0', transform: 'translateY(-1rem)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-out-down': {
                    '0%': { opacity: '1', transform: 'translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateY(-1rem)' },
                },
                'fade-in-left': {
                    '0%': { opacity: '0', transform: 'translateX(-1rem)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'fade-out-left': {
                    '0%': { opacity: '1', transform: 'translateX(0)' },
                    '100%': { opacity: '0', transform: 'translateX(-1rem)' },
                },
                'fade-in-right': {
                    '0%': { opacity: '0', transform: 'translateX(1rem)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'fade-out-right': {
                    '0%': { opacity: '1', transform: 'translateX(0)' },
                    '100%': { opacity: '0', transform: 'translateX(1rem)' },
                },
                rippleExpand: {
                    "0%": {
                        transform: "scale(0)",
                        opacity: "0.8",
                    },
                    "50%": {
                        transform: "scale(2)",
                        opacity: "0.4",
                    },
                    "100%": {
                        transform: "scale(3.5)",
                        opacity: "0",
                    },
                },
                ripplePulse: {
                    "0%, 100%": { transform: "scale(1)", opacity: "0.3" },
                    "50%": { transform: "scale(1.1)", opacity: "0.1" },
                },
            },
            animation: {
                "slide-in-left": "slideInLeft 1s ease-out forwards",
                "slide-in-right": "slideInRight 1s ease-out forwards",
                "slide-in-bottom": "slideInBottom 1s ease-out forwards",
                "fade-out": "fadeOut 1s ease-out forwards",
                float: "float 3s ease-in-out infinite",
                bounceInSlow: "bounceIn 3s ease-out forwards",
                fadeOutDelayed: "fadeOut 2s ease-in-out forwards 4s",
                marquee: "marquee 20s linear infinite",
                fadeIn: "fadeIn 0.5s forwards",
                borderGlow: "borderGlow 5s linear infinite",
                borderGlowOnce: "borderGlowOnce 7s linear forwards",
                rippleExpand: "rippleExpand 4s infinite ease-out",
                ripplePulse: "ripplePulse 2s infinite ease-in-out",
                'fade-in-up': 'fade-in-up var(--animation-duration) ease-out forwards',
                'fade-out-up': 'fade-out-up var(--animation-duration) ease-out forwards',
                'fade-in-down': 'fade-in-down var(--animation-duration) ease-out forwards',
                'fade-out-down': 'fade-out-down var(--animation-duration) ease-out forwards',
                'fade-in-left': 'fade-in-left var(--animation-duration) ease-out forwards',
                'fade-out-left': 'fade-out-left var(--animation-duration) ease-out forwards',
                'fade-in-right': 'fade-in-right var(--animation-duration) ease-out forwards',
                'fade-out-right': 'fade-out-right var(--animation-duration) ease-out forwards',
            },
        },
    },
    variants: {},
    plugins: [
        typography,
        ratio,
        function ({
            addUtilities,
        }: {
            addUtilities: (utilities: Record<string, any>) => void;
        }) {
            addUtilities({
                ".hidden-scrollbar::-webkit-scrollbar": {
                    display: "none",
                },
                ".hidden-scrollbar": {
                    "-ms-overflow-style": "none",
                    "scrollbar-width": "none",
                },
            });
        },
    ],
} satisfies Config;