import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0b1120",
          soft: "#111827",
        },
        brand: {
          50: "#eefdf5",
          100: "#d6f9e6",
          200: "#aff1cf",
          300: "#78e4b2",
          400: "#3fce90",
          500: "#16b374",
          600: "#0a905d",
          700: "#08724c",
          800: "#095a3d",
          900: "#084a34",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
