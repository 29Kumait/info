import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

export default {
    content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx,md,mdx}"],
    theme: {
        extend: {
            darkMode: 'class',

            transitionProperty: {
                'opacity': 'opacity',
            },
            backgroundImage: {
                "gradient-custom": "linear-gradient(to right, var(--tw-gradient-stops))",
                "dark-blueish-gradient": `
                    radial-gradient(
                        circle at 29% 29%,
                        rgba(4, 9, 20, 0.9) 0%,
                        rgba(12, 27, 52, 0.8) 25%,
                        rgba(7, 19, 38, 0.7) 50%,
                        rgba(5, 15, 30, 0.6) 75%,
                        rgba(3, 11, 25, 0.5) 100%
                    ),
                    linear-gradient(
                        to right,
                        rgba(20, 20, 30, 0.7) 0%,
                        rgba(30, 30, 40, 0.6) 50%,
                        rgba(40, 40, 50, 0.5) 100%
                    )
                `,
                'glass-gradient':
                    'linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))',
            },
            boxShadow: {
                'custom-ring': '0 0 10px rgba(0, 0, 255, 0.5)',
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
                "custom-gradient-01": "rgba(142, 142, 147)",
                "custom-gradient-02": "rgba(108, 108, 112)",
                "custom-gradient-03": "rgba(174, 174, 178)",
                "custom-gradient-04": "rgba(99, 99, 102)",
                "custom-gradient-05": "rgba(124, 124, 128)",
                "custom-gradient-06": "rgba(199, 199, 204)",
                "custom-gradient-07": "rgba(72, 72, 74)",
                "custom-gradient-08": "rgba(84, 84, 86)",
                "custom-gradient-09": "rgba(209, 209, 214)",
                "custom-gradient-10": "rgba(58, 58, 60)",
                "custom-gradient-11": "rgba(188, 188, 192)",
                "custom-gradient-12": "rgba(68, 68, 70)",
                "custom-gradient-13": "rgba(229, 229, 234)",
                "custom-gradient-14": "rgba(44, 44, 46)",
                "custom-gradient-15": "rgba(216, 216, 220)",
                "custom-gradient-16": "rgba(54, 54, 56)",
                "custom-gradient-17": "rgba(242, 242, 247)",
                "custom-gradient-18": "rgba(28, 28, 30)",
                "custom-gradient-19": "rgba(235, 235, 240)",
                "custom-gradient-20": "rgba(36, 36, 38)",
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
            },
            animation: {
                bounceInSlow: "bounceIn 3s ease-out forwards",
                fadeOutDelayed: "fadeOut 2s ease-in-out forwards 4s",
                marquee: "marquee 20s linear infinite",
                fadeIn: "fadeIn 0.5s forwards",
            },
        },
    },
    plugins: [typography],
} satisfies Config;