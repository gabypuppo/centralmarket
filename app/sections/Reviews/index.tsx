import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import basfSnapshot from './assets/images/basf-snapshot.png'
import ledesmaSnapshot from './assets/images/ledesma-snapshot.png'
import Image, { type StaticImageData } from 'next/image'
import DecoIcon from './assets/icons/Deco'
import Deco2Icon from './assets/icons/Deco2'

export default function ReviewsSection() {
  return (
    <section className="px-3 sm:px-6 md:px-10 lg:px-40 py-16 flex justify-center">
      <Tabs.Root
        defaultValue="tab1"
        className="max-w-4xl p-16 shadow-lg rounded-xl flex flex-col gap-4"
      >
        <Tabs.Content value="tab1">
          <Review
            client="Gonzalo Spurkel"
            role="Procurement lead | Cluster South"
            snapshot={basfSnapshot}
            videoUrl="https://ohge7d0ejmefit3r.public.blob.vercel-storage.com/homepage/Basf-VY3xPSFJPQJfSTQEX1zTzu6gdXR7ip.mp4"
          >
            <p className="text-xl md:text-2xl relative">
              <span className="block text-9xl absolute -top-12 text-gray-200 -z-10">“</span>
              Gracias a Central Market empezamos a <span className="font-bold">innovar</span> en
              nuestra área con un approach totalmente nuevo”
            </p>
          </Review>
        </Tabs.Content>
        <Tabs.Content value="tab2">
          <Review
            client="Dario Martinez"
            role="Category Manager"
            snapshot={ledesmaSnapshot}
            videoUrl="https://ohge7d0ejmefit3r.public.blob.vercel-storage.com/homepage/Ledesma-LYmG2eC5bBCNRePxcu3qs0D8LQ0D0M.mp4"
          >
            <p className="text-xl md:text-2xl relative">
              <span className="block text-9xl absolute -top-12 text-gray-200 -z-10">“</span> Gracias
              a Central Market tenemos <span className="font-bold">visibilidad</span> del spend de
              las compras menores, adaptamos nuestros procesos a las necesidades del negocio, y
              optimizamos los tiempos de entrega”
            </p>
          </Review>
        </Tabs.Content>
        <Tabs.List className="flex gap-2">
          <Tabs.Trigger
            value="tab1"
            className="size-3 rounded-full border border-[#19A863] data-[state='active']:bg-[#19A863]"
          />
          <Tabs.Trigger
            value="tab2"
            className="size-3 rounded-full border border-[#19A863] data-[state='active']:bg-[#19A863]"
          />
        </Tabs.List>
      </Tabs.Root>
    </section>
  )
}

interface ReviewProps {
  children: ReactNode
  client: string
  role: string
  snapshot: StaticImageData
  videoUrl: string
}

function Review({ children: content, client, role, snapshot, videoUrl }: ReviewProps) {
  return (
    <Dialog.Root>
      <div className="flex flex-col-reverse md:flex-row gap-16 w-fill">
        <div className="flex flex-col gap-4">
          {content}
          <div className="flex flex-col text-gray-600 leading-4 text-sm mt-auto">
            <p className="font-semibold">{client}</p>
            <p>{role}</p>
          </div>
          <Dialog.Trigger className="flex font-semibold text-sm text-[#19A863] underline w-fit">
            Ver video completo
          </Dialog.Trigger>
        </div>
        <div className="relative h-fit w-fit self-center">
          <Deco2Icon className="absolute top-4 left-0 -z-10" />
          <DecoIcon className="absolute bottom-0 left-0" />
          <Dialog.Trigger className="size-64 rounded-full overflow-hidden aria-hidden outline-none">
            <Image
              src={snapshot}
              alt={`Foto de ${client}`}
              className="w-full h-full object-cover"
            />
          </Dialog.Trigger>
        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/65 fixed inset-0 duration-150" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-svw md:w-[65svw]">
            <Dialog.Close className="absolute right-4 -top-12 md:top-4 z-40">
              <X size={32} color="#FFFFFF" />
            </Dialog.Close>
            <Dialog.Title className="hidden">Video de Reseña</Dialog.Title>
            <Dialog.Description className="hidden">Video de reseña de {client}</Dialog.Description>
            <video controls autoPlay preload="none" aria-label="Video player" className="w-full">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Dialog.Content>
        </Dialog.Portal>
      </div>
    </Dialog.Root>
  )
}
