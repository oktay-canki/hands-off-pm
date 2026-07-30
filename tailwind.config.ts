import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#00272b',
        'muted-background': '#00363d',
        surface: '#d6fff6',
        secondary: '#55868c',
        accent: '#ffc857',
      },
    },
  },
};

export default config;
