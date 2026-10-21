import { useState } from 'react'
import Hero from '../components/Hero.jsx'
import DatosConfianza from '../components/DatosConfianza.jsx'
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

  return (
    <main id="contenido">
      <Hero />
      <DatosConfianza />
      <Servicios onCotizar={setTipo} />
      <BandaFoto />
      <Cotizador tipo={tipo} onTipoChange={setTipo} />
      <Proyectos />
      <Proceso />
      <Garantias />
      <Contacto />
    </main>
  )
}
