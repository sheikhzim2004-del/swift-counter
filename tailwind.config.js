/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class", // Enable class-based dark mode switching
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#4F46E5", // indigo-600 (Main checkout button, Brand)
                    hover: "#4338CA",   // indigo-700
                    light: "#EEF2FF",   // indigo-50 (Card backgrounds, active links)
                },
                secondary: {
                    DEFAULT: "#0F172A", // slate-900 (Dark headings, sidebar)
                    text: "#64748B",    // slate-500 (Subtitles, labels)
                },
                accent: {
                    success: "#10B981", // emerald-500 (Paid, High stock)
                    warning: "#F59E0B", // amber-500 (Low stock alert)
                    danger: "#F43F5E",  // rose-500 (Out of stock, delete)
                },
                surface: {
                    DEFAULT: "#F8FAFC", // slate-50 (Page background)
                    card: "#FFFFFF",    // white (Cards, tables)
                    border: "#E2E8F0",  // slate-200 (Dividers, outlines)
                },
            },
        },
    },
    plugins: [],
};