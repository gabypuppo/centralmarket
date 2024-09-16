import Image from 'next/image'
import ledesmaLogo from './assets/images/ledesma.png'
import cavareliLogo from './assets/images/cavalieri.jpg'
import pernodRicardLogo from './assets/images/pernod-ricard.png'
import nunhemsLogo from './assets/images/nunhems.png'
import trafiguraLogo from './assets/images/trafigura.png'
import basfLogo from './assets/images/basf.png'

export default function ClientsSection() {
  return (
    <section className="px-3 sm:px-6 md:px-10 lg:px-40 bg-black flex flex-col items-center py-16 gap-16">
      <h3 className="text-white text-sm font-bold">NUESTROS CLIENTES</h3>
      <div className="max-w-full grid grid-cols-3 md:grid-cols-6 gap-4 items-center justify-items-center">
        <Image className="w-auto" src={ledesmaLogo} alt="Logo de Ledesma" />
        <Image className="w-auto" src={cavareliLogo} alt="Logo de Cavareli" />
        <Image className="w-auto" src={pernodRicardLogo} alt="Logo de Pernod Ricard" />
        <Image className="w-auto" src={nunhemsLogo} alt="Logo de Nunhems" />
        <Image className="w-auto" src={trafiguraLogo} alt="Logo de Trafigura" />
        <Image className="w-auto" src={basfLogo} alt="Logo de BASF" />
      </div>
    </section>
  )
}
