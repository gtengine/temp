import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      width: {
        "95%": "95%",
        "90%": "90%",
        "85%": "85%",
        "80%": "80%",
      },
      height: {
        "95%": "95%",
        "90%": "90%",
        "80%": "80%",
        "85%": "85%",
      },
    },
  },
  plugins: [],
};
export default config;
