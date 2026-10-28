/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          400: "#5c8bff",
          500: "#3866f2",
          600: "#2a4fd6",
          700: "#233fac",
        },
      },
    },
  },
  plugins: [],
};
