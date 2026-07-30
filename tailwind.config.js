/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#2A4D30', // Verde escuro principal
        moss: '#5C7444',   // Verde musgo de destaque
        linen: '#F4F0EA',  // Off-white/Bege de fundo
        ink: '#1C1B1A',    // Preto suave para textos
        bark: '#5C4A3D',   // Marrom terra para detalhes
      },
      fontFamily: {
        display: ['Impact', 'sans-serif'], // Fonte blocada para títulos
        body: ['Inter', 'system-ui', 'sans-serif'], // Fonte limpa para textos
      }
    },
  },
  plugins: [],
}