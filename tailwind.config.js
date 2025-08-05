/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        blink: {
          "0%, 32%, 56%, 65%": {
            color: "#ff2c2c",
            textShadow:
              "0 0 10px #ff6a6a, 0 0 40px #ff6767f5, 0 0 80px #eb2a2ad9",
          },
          "38%, 53%": {
            color: "#ff2c2c",
            textShadow:
              "0 0 10px #f000007e, 0 0 40px #d6000088, 0 0 80px #f55b6791",
          },
          "72%, 93%": {
            color: "#ff2c2c",
            textShadow: "none",
          },
        },
        orby: {
          "0%, 100%": { transform: "translateY(-4%)" },
          "60%": { transform: "translateY(4%)" },
        },
      },
      animation: {
        blink: "blink 4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite",
        orby: "orby 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};