'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import stepOneImage from './assets/images/step-1.png'
import stepTwoImage from './assets/images/step-2.png'
import ListCheckIcon from './assets/icons/ListCheck'
import ArrowsIcon from './assets/icons/Arrows'
import Button from '@/app/components/ui/Button'
import Link from 'next/link'

export default function AboutSection() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((step) => (step < 4 ? step + 1 : 0))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="px-3 sm:px-6 md:px-10 lg:px-40 py-16 h-auto flex justify-center overflow-x-hidden">
      <div className="flex gap-12 md:gap-28 flex-col md:flex-row max-w-full">
        <div className="w-full md:min-w-96 pt-8 flex flex-col gap-6 items-center md:items-start">
          <div className="text-center md:text-start">
            <h3 className="text-[#19A863] text-sm font-bold">NUESTRO PROCESO</h3>
            <p className="text-2xl font-semibold">Como lo hacemos?</p>
            <p className="max-w-64 opacity-75">Con nuestra tecnología, hacemos las cosas simples:</p>
          </div>
          <ol className="grid gap-2 auto-rows-fr">
            <li className="flex gap-2 items-center">
              <span
                className={`text-[#19A863] size-8 text-sm grid place-items-center rounded-full border border-[#19A863] flex-shrink-0 ${
                  step >= 1 ? 'font-bold' : 'font-normal'
                }`}
              >
                1
              </span>
              <p className={step >= 1 ? 'text-[#19A863]' : ''}>Registrate en Central Market</p>
            </li>
            <li className="flex gap-2 items-center">
              <span
                className={`text-[#19A863] size-8 text-sm grid place-items-center rounded-full border border-[#19A863] flex-shrink-0 ${
                  step >= 2 ? 'font-bold' : 'font-normal'
                }`}
              >
                2
              </span>
              <p className={step >= 2 ? 'text-[#19A863]' : ''}>Realizá tu pedido</p>
            </li>
            <li className="flex gap-2 items-center max-w-64">
              <span
                className={`text-[#19A863] size-8 text-sm grid place-items-center rounded-full border border-[#19A863] flex-shrink-0 ${
                  step >= 3 ? 'font-bold' : 'font-normal'
                }`}
              >
                3
              </span>
              <p className={step >= 3 ? 'text-[#19A863]' : ''}>
                Selecciona el presupuesto más conveniente
              </p>
            </li>
            <li className="flex gap-2 items-center">
              <span
                className={`text-[#19A863] size-8 text-sm grid place-items-center rounded-full border border-[#19A863] flex-shrink-0 ${
                  step >= 4 ? 'font-bold' : 'font-normal'
                }`}
              >
                4
              </span>
              <p className={step >= 4 ? 'text-[#19A863]' : ''}>Recibí el producto</p>
            </li>
          </ol>
          <Link href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3gQisYIy60ALSmVUcqVolQhXSRY3pKUFKJe_pExSnNfP9ESTIJjyAG320FHH79FWDpCcebgA3N" target="_blank">
            <Button className="text-white">Agendar reunión</Button>
          </Link>
        </div>
        <div className="flex-auto min-w-64 max-w-sm flex justify-end h-[36rem] translate-x-1/4 md:translate-x-0">
          <div className="w-48 h-56 bg-[#19A863] bg-opacity-10 rounded-xl relative">
            <div
              className={`absolute bottom-4 left-10 w-52 translate-y-full z-10 duration-1000 ${
                step >= 1 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image src={stepOneImage} alt="Imagen primer paso" />
            </div>
            <div
              className={`absolute top-6 right-10 w-80 duration-1000 ${
                step >= 2 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image src={stepTwoImage} alt="Imagen segundo paso" />
              <div
                className={`absolute top-20 -left-24 bg-white w-48 rounded-lg flex gap-2 items-center shadow-lg shadow-black/15 p-4 duration-1000 ${
                  step >= 3 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div
                  className={`flex-shrink-0 size-10 rounded-full grid place-items-center duration-1000 ${
                    step >= 4 ? 'bg-[#979797]' : 'bg-[#19A863]'
                  }`}
                >
                  <ListCheckIcon />
                </div>
                <p className="text-sm text-[#161C2D]">Nueva orden creada</p>
                <div
                  className={`bg-[#19A863] p-6 rounded-lg absolute -bottom-2 translate-y-full duration-1000 ${
                    step >= 4 ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <p className="text-white">Pedido recibido</p>
                  <ArrowsIcon className="absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
