import plugin from 'tailwindcss/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Paleta cerrada: solo estos tokens existen como colores.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      concrete: '#ECECEA',
      graphite: '#2A2C2E',
      cement: '#8B8F94',
      safety: '#FF6A13',
    },
    extend: {
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        revelar: {
          from: { opacity: '0', transform: 'translateY(0.35em)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        // 400 ms + 200 ms de retraso máximo = 600 ms en total.
        revelar: 'revelar 400ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
      },
    },
  },
  plugins: [
    // Eje de ancho (wdth) de Archivo.
    plugin(({ addUtilities }) => {
      addUtilities({
        '.ancho-condensado': {
          'font-stretch': '62%',
          'font-variation-settings': '"wdth" 62',
        },
        '.ancho-semi': {
          'font-stretch': '75%',
          'font-variation-settings': '"wdth" 75',
        },
        '.ancho-normal': {
          'font-stretch': '100%',
          'font-variation-settings': '"wdth" 100',
        },
      })
    }),
  ],
}
