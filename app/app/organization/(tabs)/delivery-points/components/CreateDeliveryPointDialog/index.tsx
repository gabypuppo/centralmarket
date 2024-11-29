'use client'
import React, { type FormEvent, useState } from 'react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Separator } from '@/components/ui/Separator'
import { createDeliveryPointAction } from '@/utils/actions'
import type { DeliveryPoint } from '@/db/organizations'
import { useRouter } from 'next/navigation'

export function CreateDeliveryPointDialog({ organizationId }: { organizationId: number }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    const nameInput = e.currentTarget.elements.namedItem('name') as HTMLInputElement
    const addressInput = e.currentTarget.elements.namedItem('address') as HTMLInputElement
    const cityInput = e.currentTarget.elements.namedItem('city') as HTMLInputElement
    const stateInput = e.currentTarget.elements.namedItem('state') as HTMLInputElement
    const countryInput = e.currentTarget.elements.namedItem('country') as HTMLInputElement
    const postalCodeInput = e.currentTarget.elements.namedItem('postalCode') as HTMLInputElement
    const additionalInfoInput = e.currentTarget.elements.namedItem(
      'additionalInfo'
    ) as HTMLInputElement

    const DeliveryPoint: Omit<DeliveryPoint, 'id'> = {
      organizationId,
      name: nameInput.value,
      address: addressInput.value,
      city: cityInput.value,
      state: stateInput.value,
      country: countryInput.value,
      postalCode: postalCodeInput.value,
      additionalInfo: additionalInfoInput.value
    }

    return await createDeliveryPointAction(DeliveryPoint)
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger className="self-start" asChild>
        <Button>Nuevo Punto de Entrega</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-slate-600/50 fixed inset-0" />
        <AlertDialog.Content className="bg-white rounded p-6 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[50%] w-[90vw] max-w-lg max-h-screen overflow-y-auto">
          <AlertDialog.Title className="text-xl font-semibold">
            Nuevo punto de entrega
          </AlertDialog.Title>
          <Separator className="my-2" />
          <span className='text-gray-400 my-2 text-sm'>Los campos con * son obligatorios</span>
          <form
            className="flex flex-col gap-2 mt-2"
            onSubmit={(e) => {
              e.preventDefault()
              handleCreate(e).then(() => setOpen(false))
              e.currentTarget.reset()
              router.refresh()
            }}
            onReset={() => {
              setOpen(false)
            }}
          >
            <label className="flex flex-col gap-2">
              Nombre*
              <Input name="name" placeholder="Nombre" required />
            </label>
            <label className="flex flex-col gap-2">
              Dirección*
              <Input name="address" placeholder="Dirección" required />
            </label>
            <div className="flex gap-4">
              <label className="flex flex-col flex-1 gap-2">
                Ciudad*
                <Input name="city" placeholder="Ciudad" required />
              </label>
              <label className="flex flex-col flex-1 gap-2">
                Estado/Provincia*
                <Input name="state" placeholder="Estado/Provincia" required />
              </label>
            </div>
            <div className="flex gap-4">
              <label className="flex flex-col flex-1 gap-2">
                País*
                <Input name="country" placeholder="País" required />
              </label>
              <label className="flex flex-col flex-1 gap-2">
                Código Postal*
                <Input name="postalCode" placeholder="Código Postal" required />
              </label>
            </div>
            <label className="flex flex-col gap-2">
              Información Adicional*
              <Input name="additionalInfo" placeholder="Información Adicional" />
            </label>
            <div className="flex gap-4 mt-6">
              <Button className="flex-1" type="reset" variant="secondary">
                Cancelar
              </Button>
              <Button className="flex-1" type="submit">
                Crear
              </Button>
            </div>
          </form>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
