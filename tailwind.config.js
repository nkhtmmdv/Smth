/** @type {import('tailwindcss').Config} */
export default {
  content: ["./client/index.html", "./client/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0b0c0f",
          900: "#111319",
          800: "#1a1d26",
          700: "#262a36",
          600: "#3a3f4f",
          500: "#565d70",
          400: "#7b8296",
          300: "#a8adbc",
          200: "#d3d6de",
          100: "#eceef2",
          50: "#f6f7f9"
        },
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#b8cfff",
          300: "#8bb0ff",
          400: "#5c8bff",
          500: "#3466f6",
          600: "#254fd6",
          700: "#1e3fac",
          800: "#1c368a",
          900: "#1b306f"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 18, 25, 0.04), 0 8px 24px rgba(15, 18, 25, 0.06)",
        card: "0 1px 2px rgba(15, 18, 25, 0.05), 0 16px 40px rgba(15, 18, 25, 0.08)"
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(0%)", opacity: "0.2" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0.2" }
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        }
      },
      animation: {
        scan: "scan 2.4s ease-in-out infinite",
        "fade-up": "fade-up 0.4s ease-out both",
        "pop-in": "pop-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both"
      }
    }
  },
  plugins: []
};
