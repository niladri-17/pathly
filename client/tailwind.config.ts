module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        // Map CSS variables to Tailwind color names
        "card-hover": "var(--card-hover)",
      },
    },
  },
  plugins: [],
};

// import type { Config } from "tailwindcss";

// const config: Config = {
//   content: ["./src/**/*.{js,ts,jsx,tsx}", "./index.html"],
//   theme: {
//     extend: {
//       colors: {
//         "card-hover": "var(--card-hover)",
//       },
//     },
//   },
//   plugins: [],
// };

// export default config;
