/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "sans-serif"] },
      colors: {
        tl: {
          darkest:  "#041421",
          dark:     "#042630",
          mid:      "#4c7273",
          light:    "#86b9b0",
          pale:     "#d0d6d6",
        }
      }
    },
  },
  plugins: [],
}
