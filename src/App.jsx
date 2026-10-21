import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Inicio from './pages/Inicio.jsx'
import { RUTA_AVISO, RUTA_POLITICA } from './lib/aviso.js'

const AvisoPrivacidad = lazy(() => import('./pages/AvisoPrivacidad.jsx'))
const PoliticaTratamiento = lazy(() => import('./pages/PoliticaTratamiento.jsx'))

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
        <Route
          path={RUTA_AVISO}
          element={
            <Suspense fallback={<div className="min-h-screen" />}>
              <AvisoPrivacidad />
            </Suspense>
          }
        />
        <Route
          path={RUTA_POLITICA}
          element={
            <Suspense fallback={<div className="min-h-screen" />}>
              <PoliticaTratamiento />
            </Suspense>
          }
        />
        <Route path="*"element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  )
}
