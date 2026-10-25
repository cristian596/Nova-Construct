import plugin from 'tailwindcss/plugin'
import { MARCA } from './src/data/marca.js'

/** @type {import('tailwindcss').Config} */
export default {
  // hover: solo se aplica en dispositivos con puntero fino (@media (hover: hover) and (pointer: fine)).
  future: {
    hoverOnlyWhenSupported: true,
  },
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
        sans: ['Archivo Variable', 'system-ui', 'sans-serif'],
      },
      // Solo definen el estado inicial (from): el final es el estilo base del elemento,
      // así con prefers-reduced-motion (animate-none) todo queda en su posición final.
      keyframes: {
        // Carrusel de proyectos: barra de progreso y entrada de los datos del proyecto activo.
        progreso: {
          from: { transform: 'scaleX(0)' },
        },
        entrada: {
          from: { opacity: '0', transform: 'translate3d(0, 8px, 0)' },
        },
      },
      animation: {
        // 3 s = intervalo del carrusel: la barra termina y su animationend avanza al siguiente proyecto.
        progreso: 'progreso 3s linear both',
        // Tarjeta del hero: 5 s por proyecto.
        'progreso-hero': 'progreso 5s linear both',
        entrada: 'entrada 240ms cubic-bezier(0.22, 1, 0.36, 1) both',
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
