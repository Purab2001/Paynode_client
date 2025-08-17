import withMT from "@material-tailwind/react/utils/withMT.js";

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom dark mode colors
        dark: {
          50: "#f5f6f7",
          100: "#e9ebee",
          200: "#d6d9dd",
          300: "#bfc6cd",
          400: "#9ea9b4",
          500: "#7f8a95",
          600: "#5f6670",
          700: "#45494d",
          800: "#393E46",
          900: "#222831",
          950: "#0b0c0e",
        },
      },
    },
  },
  plugins: [],
});
