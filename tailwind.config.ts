import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'minecraft': {
          'grass': '#4CAF50',
          'dirt': '#8B4513',
          'stone': '#808080',
          'wood': '#D2691E',
        },
        'fortnite': {
          'primary': '#7289DA',
          'secondary': '#FFD700',
          'background': '#36393F',
          'accent': '#23272A',
        }
      },
      fontFamily: {
        'minecraft': ['Minecraft', 'sans-serif'],
        'fortnite': ['Burbank Big Cd Bk', 'sans-serif']
      },
      backgroundImage: {
        'minecraft-grid': 'linear-gradient(45deg, rgba(76, 175, 80, 0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(76, 175, 80, 0.1) 25%, transparent 25%)',
        'fortnite-gradient': 'linear-gradient(135deg, #7289DA 0%, #23272A 100%)'
      },
      boxShadow: {
        'minecraft-block': '0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
        'fortnite-card': '0 8px 16px rgba(0,0,0,0.4)'
      }
    },
  },
  plugins: [],
}
export default config 