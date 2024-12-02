'use client'
import AlertDialog from '@/components/ui/AlertDialog'
import { deleteCreatedByInOrdersAction, setUserOrganizationAction } from '@/utils/actions'
import { TrashIcon } from 'assets/icons'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function RemoveUserAlertDialog({ userId }: { userId: number }) {
  const router = useRouter()

  return (
    <AlertDialog
      message="¿Estás seguro que queres eliminar el usuario?"
      onConfirm={async () => {
        await setUserOrganizationAction(userId, null)
        await deleteCreatedByInOrdersAction(userId)
        router.refresh()
      }}
      confirmText='Eliminar'
      onDismiss={() => {}}
      dismissText='Cancelar'
    >
      <TrashIcon className="w-4 h-4" />
      <span className="sr-only">Eliminar usuario</span>
    </AlertDialog>
  )
}
