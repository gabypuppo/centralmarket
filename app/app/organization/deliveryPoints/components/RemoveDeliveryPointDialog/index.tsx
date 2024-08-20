'use client'
import AlertDialog from '@/components/ui/AlertDialog'
import { deleteDeliveryPointAction } from '@/utils/actions'
import { TrashIcon } from 'assets/icons'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function RemoveDeliveryPointDialog({ DeliveryPointId }: { DeliveryPointId: number }) {
  const router = useRouter()

  return (
    <AlertDialog
      message="Estas seguro que queres eliminar este Punto de Entrega?"
      onConfirm={async () => {
        await deleteDeliveryPointAction(DeliveryPointId)
        router.refresh()
      }}
      confirmText='Eliminar'
      onDismiss={() => {}}
      dismissText='Cancelar'
    >
      <TrashIcon className="w-4 h-4" />
      <span className="sr-only">Eliminar</span>
    </AlertDialog>
  )
}
