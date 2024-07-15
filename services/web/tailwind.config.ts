import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      colors: {
        primary: '#299479',
        'primary-dark': '#117180',
        'primary-light': '#35A576',
        secondary: '#755A9F',
        customPink: '#FCBAFB',
        customGreen: '#e2efda',
      },
    },
  },
  plugins: [],
};
export default config;
