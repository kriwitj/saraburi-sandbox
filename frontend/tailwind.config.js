/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sandbox: {
          dark: '#0B131E',      // Background dark deep
          card: '#162235',      // Card dark slate
          border: '#283B57',    // Borders slate grey
          green: '#10B981',     // Green energy accent
          mint: '#34D399',      // Bright accent green
          blue: '#3B82F6',      // Tech blue
          forest: '#047857'     // Community forest deep green
        }
      },
      fontFamily: {
        sans: ['Inter', 'Sarabun', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon': '0 0 15px rgba(16, 185, 129, 0.4)',
        'neon-blue': '0 0 15px rgba(59, 130, 246, 0.4)'
      }
    },
  },
  plugins: [],
}
