'use client'
import { Button } from '@/components/ui/Button'
import { useOrderContext } from '@/contexts/OrderContext'
import { OrderStatusEnum } from '@/utils/enums'
import * as Dialog from '@radix-ui/react-alert-dialog'
import { useMemo, useState } from 'react'
import { addHistoryAction, updateOrderAction } from '@/utils/actions'
import { getFormattedLabel } from '@/app/app/orders/utils'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'

interface NextOrderStateDialogProps {
  children: React.ReactNode
  disabled?: boolean
}
export default function NextOrderStateDialog({ children, disabled = false }: NextOrderStateDialogProps) {
  const router = useRouter()
  const { user } = useUser()
  const { contextOrderData: orderData, setContextOrderData } = useOrderContext()
  const [open, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const newStatus = useMemo(() => {
    return OrderStatusEnum[OrderStatusEnum[orderData.orderStatus!] + 1] as OrderStatus
  }, [orderData])
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsUploading(true)
    updateOrderAction({
      ...orderData,
      orderStatus: newStatus,
      approvedAt: newStatus === 'COMPLETED' ? new Date() : undefined
    })
      .then((res) => {
        setContextOrderData(res[0])
        return addHistoryAction({
          orderId: orderData.id,
          label: getFormattedLabel(newStatus),
          modifiedBy: user?.organizationId === 1 ? 'Central Market' : 'Usuario'
        })
      })
      .then(() => {
        router.refresh()
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsUploading(false)
        setIsOpen(false)
      })
  }

  return (
    <Dialog.Root open={open} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button className="mt-4" disabled={disabled}>{children}</Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 max-w-md p-6 bg-white rounded-lg transform -translate-x-1/2 -translate-y-1/2 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">
            Avanzar a la siguiente etapa
          </Dialog.Title>
          <Dialog.Description className="mt-2 mb-4 text-sm text-gray-600">
            Estas seguro que quieres avanzar a{' '}
            <span className="font-bold">{`"${getFormattedLabel(newStatus)}"`}</span>
          </Dialog.Description>
          <form className="space-y-4" onSubmit={(e) => onSubmit(e)}>
            <div className="mt-6 flex justify-end space-x-2">
              <Dialog.Cancel asChild>
                <Button
                  variant="secondary"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  type="reset"
                  onClick={() => setIsOpen(false)}
                  disabled={isUploading}
                >
                  Cancelar
                </Button>
              </Dialog.Cancel>
              <Button className="px-4 py-2" type="submit">
                Aceptar
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
