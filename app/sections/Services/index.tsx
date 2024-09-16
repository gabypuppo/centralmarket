import ClockIcon from './assets/icons/Clock'
import CheckedBoxIcon from './assets/icons/CheckedBox'
import MapIcon from './assets/icons/Map'
import type { ReactNode } from 'react'
import Image from 'next/image'
import backgroundDeco from './assets/images/background-deco.png'

export default function ServicesSection() {
  return (
    <section className="px-3 sm:px-6 md:px-10 lg:px-40 py-16 flex flex-col gap-4 relative">
      <h3 className="text-[#19A863] text-sm font-bold">NUESTROS SERVICIOS</h3>
      <p className="text-2xl font-semibold">Nuestros Resultados</p>
      <div className="pt-2 w-auto self-center grid gap-8 md:gap-2 xl:gap-8 grid-cols-1 md:grid-cols-3 justify-items-center">
        <Card icon={<ClockIcon />}>
          <p className="text-center text-lg">Ahorramos más de <span className="font-bold">100.000 horas</span> de trabajo</p>
        </Card>
        <Card icon={<CheckedBoxIcon />}>
          <p className="text-center text-lg">Bajamos el tiempo de <span className="font-bold">resolución</span> en un 66%</p>
        </Card>
        <Card icon={<MapIcon />}>
          <p className="text-center text-lg">Brindamos <span className="font-bold">visibilidad y trazabilidad</span> sobre las compras</p>
        </Card>
      </div>
      <Image src={backgroundDeco} alt="background decoration" aria-hidden className="absolute right-0 -bottom-1 -z-10" />
    </section>
  )
}

interface CardProps {
  icon?: ReactNode
  children?: ReactNode
}

function Card({ icon, children }: CardProps) {
  return (
    <div className="w-full flex-1 md:max-w-72 px-8 py-16 shadow-md bg-white flex flex-col items-center gap-8 rounded-md border border-transparent hover:border-[#19A863] duration-200">
      {icon && (
        <div className="p-3 bg-[#19A8631A] rounded-full">
          <div className="bg-[#19A8631A] rounded-full w-24 h-24 grid place-items-center">{icon}</div>
        </div>
      )}
      {children}
    </div>
  )
}
