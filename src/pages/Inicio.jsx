import { useState } from 'react'
import Hero from '../components/Hero.jsx'
import Servicios from '../components/Servicios.jsx'
import BandaFoto from '../components/BandaFoto.jsx'
import Cotizador from '../components/Cotizador.jsx'
import Proyectos from '../components/Proyectos.jsx'
import Proceso from '../components/Proceso.jsx'
import Garantias from '../components/Garantias.jsx'
import Contacto from '../components/Contacto.jsx'

export default function Inicio() {
  // El tipo vive aquí para que "Cotizar" en Servicios lo preseleccione.
  const [tipo, setTipo] = useState('')

  // Secciones bajo el pliegue: el navegador omite su render hasta que se acercan. Los IDs siguen en cada <section>.
  return (
    <main id="contenido">
      <Hero />
      <Servicios onCotizar={setTipo} />
      <BandaFoto />
      <Cotizador tipo={tipo} onTipoChange={setTipo} />
      <div className="[contain-intrinsic-size:auto_900px] [content-visibility:auto]">
        <Proyectos />
      </div>
      <div className="[contain-intrinsic-size:auto_700px] [content-visibility:auto]">
        <Proceso />
      </div>
      <div className="[contain-intrinsic-size:auto_700px] [content-visibility:auto]">
        <Garantias />
      </div>
      <div className="[contain-intrinsic-size:auto_1000px] [content-visibility:auto]">
        <Contacto />
      </div>
    </main>
  )
}
