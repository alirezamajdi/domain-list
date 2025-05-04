/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3B82F6",
          50: "#EBF2FF",
          100: "#D7E6FF",
          200: "#B0CDFF",
          300: "#89B4FF",
          400: "#629BFF",
          500: "#3B82F6",
          600: "#0B61FF",
          700: "#0047D4",
          800: "#0035A1",
          900: "#00236E",
          950: "#001A52",
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
