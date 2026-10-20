import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Inicio from './pages/Inicio.jsx'
import AvisoPrivacidad from './pages/AvisoPrivacidad.jsx'
import { RUTA_AVISO } from './lib/aviso.js'

export default function App() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-[60] bg-safety px-4 py-3 font-semibold text-graphite focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path={RUTA_AVISO} element={<AvisoPrivacidad />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}
