// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            primary: '#0d68f3',
            secondary: '#50e3c2',
            background: '#f6f5fa',
            text: '#505050',
            highlight: '#f75654',

        },
    },
  },
  plugins: [],
}
