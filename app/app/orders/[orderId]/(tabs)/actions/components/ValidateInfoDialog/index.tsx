import { Button } from '@/components/ui/Button'
import * as Dialog from '@/components/ui/AlertDialogComplete'
import { revalidatePath } from 'next/cache'
import { addHistory, getProductsByOrderId, updateOrder, type Order } from '@/db/orders'
import { auth } from '@/auth'
import { sendMailOrderInformationCompleteAction, sendMailOrderInformationIncompleteAction } from '@/utils/actions'
import { isCentralMarketUser } from '@/auth/authorization'

interface ValidateInfoDialogProps {
  order: Order
}
export default async function ValidateInfoDialog({ order }: ValidateInfoDialogProps) {
  const session = await auth()
  if (!session) return

  const needMoreInformationAction = async () => {
    'use server'
    await updateOrder({
      id: order.id,
      orderStatus: 'ADDITIONAL_INFORMATION_PENDING',
      updatedAt: new Date(),
      followUpMail1DaySent: false,
      followUpMail3DaySent: false
    })

    await addHistory({
      orderId: order.id,
      label: 'Pedido necesita mas información',
      modifiedBy: isCentralMarketUser(session.user) ? 'Central Market' : 'Usuario'
    })

    if (!order.id || !order.createdBy || !order.createdAt) {
      console.error('No se pudo enviar el mail')
      revalidatePath(`/${order.id}/actions`)
      return
    }

    await sendMailOrderInformationIncompleteAction(order.id, order.createdBy, order.createdAt)

    revalidatePath(`/${order.id}/actions`) 
  }

  const continueInformationAction = async () => {
    'use server'
    if (!session) return

    await updateOrder({
      id: order.id,
      orderStatus: 'BUDGETS_IN_PROGRESS',
      updatedAt: new Date()
    })

    await addHistory({
      orderId: order.id,
      label: 'Información del pedido completada',
      modifiedBy: isCentralMarketUser(session.user) ? 'Central Market' : 'Usuario'
    })

    await addHistory({
      orderId: order.id,
      label: 'Presupuestos en progreso',
      modifiedBy: isCentralMarketUser(session.user) ? 'Central Market' : 'Usuario'
    })

    const products = await getProductsByOrderId(order.id)

    if (!order.id || !order.createdBy || !order.assignedBuyerId || !order.createdAt || !products) return

    sendMailOrderInformationCompleteAction(order.id, order.createdBy, order.assignedBuyerId, order.createdAt, products)

    revalidatePath(`/${order.id}/actions`)
  }
  
  return (
    <Dialog.AlertDialog>
      <Dialog.AlertDialogTrigger asChild className="flex mt-4">
        <Button variant="default">Validar información</Button>
      </Dialog.AlertDialogTrigger>
      <Dialog.AlertDialogContent>
        <Dialog.AlertDialogHeader>
          <Dialog.AlertDialogTitle>¿Estas seguro?</Dialog.AlertDialogTitle>
          <Dialog.AlertDialogDescription>
            Al validar la información del pedido, se procederá a la etapa de presupuestación. Por
            favor, verifica que toda la información necesaria para hacer el pedido este completa.
          </Dialog.AlertDialogDescription>
        </Dialog.AlertDialogHeader>
        <Dialog.AlertDialogFooter>
          <Dialog.AlertDialogCancel>Cancelar</Dialog.AlertDialogCancel>
          <form action={needMoreInformationAction}>
            <Dialog.AlertDialogAction type="submit" className="bg-red-600 hover:bg-red-500">
              Pedir mas información
            </Dialog.AlertDialogAction>
          </form>
          <form action={continueInformationAction}>
            <Button type="submit">Continuar</Button>
          </form>
        </Dialog.AlertDialogFooter>
      </Dialog.AlertDialogContent>
    </Dialog.AlertDialog>
  )
}
