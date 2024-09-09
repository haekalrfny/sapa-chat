/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        slideIn: "slideIn 0.3s ease-out",
        slideOut: "slideOut 0.3s ease-in",
        bounce: "bounce 0.3s ease",
        slideFromBottom: "slideFromBottom 0.3s ease",
        slidefromTop: "slidefromTop 0.3s ease",
        bounceIn: "bounceIn 0.2s ease-out",
        bounceOut: "bounceOut 0.2s ease-in",
        fadeIn: "fadeIn 0.2s ease-out",
        fadeOut: "fadeOut 0.2s ease-in",
        slideInLeft: "slideInLeft 0.2s ease-out",
        slideOutLeft: "slideOutLeft 0.2s ease-in",
        slideContentIn: "slideContentIn 0.3s ease-out",
        slideContentOut: "slideContentOut 0.3s ease-in",
      },
      keyframes: {
        slideContentIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideContentOut: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(-20px)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideOutLeft: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(-100%)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(1000px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideOut: {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(1000px)" },
        },
        bounce: {
          "0%": { transform: "translateY(-1000px)" },
          "100%": { transform: "translateY(0)" },
        },
        slideFromBottom: {
          "0%": { transform: "translateY(1000px)" },
          "100%": { transform: "translateY(0)" },
        },
        slidefromTop: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(1000px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeOut: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-10px)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "translateY(-50px)" },
          "60%": { opacity: "1", transform: "translateY(10px)" },
          "100%": { transform: "translateY(0)" },
        },
        bounceOut: {
          "0%": { transform: "translateY(0)" },
          "40%": { opacity: "1", transform: "translateY(10px)" },
          "100%": { opacity: "0", transform: "translateY(-50px)" },
        },
      },
    },
  },
  plugins: [],
};
