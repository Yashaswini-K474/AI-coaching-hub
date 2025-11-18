/** @type {import('tailwindcss').Config} */
// export const content = [
//   "./app/**/*.{js,ts,jsx,tsx}",
//   "./pages/**/*.{js,ts,jsx,tsx}",
//   "./components/**/*.{js,ts,jsx,tsx}",
// ];
// export const theme = {
//   extend: {},
// };
// export const plugins = [];

/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{js,ts,jsx,tsx}",
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
];

export const theme = {
  extend: {
    colors: {
      primary: 'var(--primary)',
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      destructive: 'var(--destructive)',
      customGray: '#e5e5e5', 
    },
  },
};

export const plugins = [];
