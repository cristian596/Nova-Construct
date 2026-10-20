import plugin from 'tailwindcss/plugin'
import { MARCA } from './src/data/marca.js'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Paleta cerrada: solo estos tokens existen como colores. Los valores viven en src/data/marca.js.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...MARCA.colores,
    },
    extend: {
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
      },
      // Solo definen el estado inicial (from): el final es el estilo base del elemento,
      // así con prefers-reduced-motion (animate-none) todo queda en su posición final.
      keyframes: {
        // La línea sube desde debajo de su máscara (overflow-hidden).
        revelar: {
          from: { transform: 'translate3d(0, 125%, 0)' },
        },
        trazar: {
          from: { transform: 'scaleX(0)' },
        },
        aparecer: {
          from: { opacity: '0' },
        },
        'zoom-lento': {
          from: { transform: 'scale3d(1.08, 1.08, 1)' },
        },
        // Línea naranja que entra por arriba, cruza la pista y sale por abajo.
        indicador: {
          '0%': { transform: 'translate3d(0, -100%, 0)' },
          '50%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(0, 100%, 0)' },
        },
      },
      animation: {
        revelar: 'revelar 800ms cubic-bezier(0.16, 1, 0.3, 1) both',
        trazar: 'trazar 450ms cubic-bezier(0.65, 0, 0.35, 1) both',
        aparecer: 'aparecer 300ms ease-out both',
        'zoom-lento': 'zoom-lento 8s cubic-bezier(0.22, 0.61, 0.36, 1) both',
        indicador: 'indicador 2.4s cubic-bezier(0.65, 0, 0.35, 1) infinite',
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
