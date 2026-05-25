/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        linen: "#fffaf3",
        blush: "#f5dad8",
        rosewood: "#8a4f4b",
        ink: "#241f1e",
        sage: "#7f8f75",
        honey: "#c99454",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(70, 45, 33, 0.10)",
        lift: "0 22px 55px rgba(100, 58, 45, 0.18)",
      },
    },
  },
  plugins: [],
};
