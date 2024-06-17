/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // If you still want to keep a primary solid color, you can define it here
        primary: '#405138',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(41,82,134,1) 27%, rgba(50,50,156,1) 83%, rgba(18,126,191,1) 98%)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}
