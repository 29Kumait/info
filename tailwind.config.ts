import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';
import ratio from "@tailwindcss/aspect-ratio";

export default {
    content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx,md,mdx}"],
    darkMode: 'class',

    theme: {
        extend: {
            transitionProperty: {
                'opacity': 'opacity',
            },
            boxShadow: {
                'custom-ring': '0 0 10px rgba(0, 0, 255, 0.5)',
            },
            dropShadow: {
                'bright-glow': '0 0 4em rgba(255, 255, 255, 0.9)',
                'blue-glow': '0 0 4em rgba(0, 123, 255, 0.9)',
            },
            colors: {
                "dark-blue-black-01": "rgba(4, 9, 20, 0.9)",
                "dark-blue-black-02": "rgba(12, 27, 52, 0.8)",
                "dark-blue-black-03": "rgba(7, 19, 38, 0.7)",
                "dark-blue-black-04": "rgba(5, 15, 30, 0.6)",
                "dark-blue-black-05": "rgba(3, 11, 25, 0.5)",
                "bright-blue-black": "rgba(50, 50, 80, 0.8)",
                "bluish-black-01": "rgba(10, 10, 20, 0.9)",
                "bluish-black-02": "rgba(10, 20, 30, 0.8)",
                "bluish-black-03": "rgba(20, 30, 40, 0.7)",

            },
            keyframes: {
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
                    "0%": { opacity: '0', transform: "translateY(20px)" },
                    "100%": { opacity: '1', transform: "translateY(0)" },
                },
                fadeOut: {
                    "0%": { opacity: "1" },
                    "100%": { opacity: "0.3" },
                },
                marquee: {
                    "0%": { transform: "translateX(0)" },
                    "100%": { transform: "translateX(-50%)" },
                },
                borderGlow: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '100%': { backgroundPosition: '200% 50%' },
                },

            },
            animation: {
                bounceInSlow: "bounceIn 3s ease-out forwards",
                fadeOutDelayed: "fadeOut 2s ease-in-out forwards 4s",
                marquee: "marquee 20s linear infinite",
                fadeIn: "fadeIn 0.5s forwards",
                borderGlow: 'borderGlow 5s linear infinite',
                borderGlowOnce: 'borderGlow 5s linear forwards',
            },
        },
    },
    plugins: [typography, ratio],
} satisfies Config;