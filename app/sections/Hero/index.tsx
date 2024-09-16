import Button from '@/app/components/ui/Button'
import heroBackground from './assets/images/hero-background.png'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section
      className="h-[80svh] md:h-svh bg-cover bg-center relative"
      style={{ backgroundImage: `url(${heroBackground.src})` }}
    >
      <div className="px-3 sm:px-6 md:px-10 lg:px-40 h-full w-full absolute bg-gradient-to-b	from-neutral-600/20 via-neutral-800/40 to-neutral-800/80 bg-blend-multiply flex flex-col items-center justify-center gap-6 text-white">
        <h2 className="max-w-4xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-center leading-relaxed">
          Te ayudamos a <span className="font-bold">gestionar tus compras</span> de manera
          inteligente
        </h2>
        <p className="max-w-2xl md_text-lg lg:text-xl text-center leading-relaxed">
          En Central Market nos encargamos de reducir los gastos en compras, los tiempos de entrega
          de los pedidos y gestionamos los proveedores de nuestros clientes
        </p>
        <Link href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3gQisYIy60ALSmVUcqVolQhXSRY3pKUFKJe_pExSnNfP9ESTIJjyAG320FHH79FWDpCcebgA3N" target="_blank">
          <Button>Solicitar demo</Button>
        </Link>
      </div>
    </section>
  )
}
