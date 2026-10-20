import { useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Servicios from './components/Servicios.jsx'
import Cotizador from './components/Cotizador.jsx'
import Proyectos from './components/Proyectos.jsx'
import Proceso from './components/Proceso.jsx'
import Garantias from './components/Garantias.jsx'
import Contacto from './components/Contacto.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  // El tipo vive aquí para que "Cotizar" en Servicios lo preseleccione.
  const [tipo, setTipo] = useState('')

  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-[60] bg-safety px-4 py-3 font-semibold text-graphite focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">
        <Hero />
        <Servicios onCotizar={setTipo} />
        <Cotizador tipo={tipo} onTipoChange={setTipo} />
        <Proyectos />
        <Proceso />
        <Garantias />
        <Contacto />
      </main>
      <Footer />
    </>
  )
}
