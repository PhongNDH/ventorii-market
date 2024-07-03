import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backgroundColor: {
        'layer-1': '#07090E',
        'layer-2': '#0F131C',
        'layer-3': '#1B2333',
        'layer-4': '#323268',
        'layer-focus': '#364055',
      },
      borderColor: {
        DEFAULT: '#A688FF',
        stroke: '#1D2535',
        divider: '#1B2332',
        focus: '#4F5C71',
      },
      colors: {
        primary: '#00C089',
        'primary-hover': '#008861',
        secondary: '#94A7C6',
        tertiary: '#41516C',
        placeholder: '#6D7080',
        disabled: '#6D7080',
        grey: '#A1B0CC',
        error: '#E94949',
        'semi-black': '#0F131C',
        dark: '#030209',
      },
      fontFamily: {
        montserrat: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
};
export default config;
