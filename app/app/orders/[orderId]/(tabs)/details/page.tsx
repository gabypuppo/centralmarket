import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { getOrderById } from '@/db/orders'
import { getDeliveryPointById } from '@/db/organizations'
import { getUserById } from '@/db/users'
import React from 'react'
import { OrderStatusEnum } from '@/utils/enums'
import AssignCreatedByButton from './components/AssignCreatedByButton'
import { Button } from '@/components/ui/Button'
import { updateOrderAction } from '@/utils/actions'
import { isCentralMarketUser } from '@/auth/authorization'
import ConfirmArrivalButton from './components/ConfirmArrivalButton'

interface PageProps {
  params: {
    orderId: string
  }
}
export default async function Page({ params }: PageProps) {
  const session = await auth()
  if (!session) return

  const order = await getOrderById(parseInt(params.orderId))

  const createdByPromise = order.createdBy ? getUserById(order.createdBy) : null
  const deliveryPointPromise = getDeliveryPointById(order.deliveryPointId!)

  const [createdBy, deliveryPoint] = await Promise.all([createdByPromise, deliveryPointPromise])

  const isShippingInProgress = OrderStatusEnum[order.orderStatus!] >= OrderStatusEnum.SHIPPING_IN_PROGRESS

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles</CardTitle>
        <CardDescription>Aquí puedes ver los detalles de tu pedido.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex flex-col gap-4 items-start">
        <div className="flex flex-col gap-1">
          {order.orderStatus === 'REJECTED' && (
            <div>
              <span className="font-bold">
                Se genero una disputa para este pedido. Por favor, revisar el mail para mas
                detalles.
              </span>
              <form
                action={async () => {
                  'use server'
                  await updateOrderAction({
                    id: order.id,
                    orderStatus: 'COMPLETED',
                    updatedAt: new Date()
                  })
                }}
              >
                <Button variant="outline" className="mt-2" type="submit">
                  Disputa resuelta
                </Button>
              </form>
            </div>
          )}
          <h3 className="font-medium">Detalles de Creación</h3>
          <p className="text-sm">
            Gestionado por:{' '}
            {createdBy ? `${createdBy?.firstName} ${createdBy?.lastName}` : 'Sin asignar'}
          </p>
          {!createdBy && session?.user.organizationId === order.organizationId && (
            <AssignCreatedByButton order={order} />
          )}
          <p className="text-sm">Fecha de creación: {order.createdAt?.toLocaleDateString()}</p>
          <p className="text-sm">Numero de remito: {order.remittance ?? 'Sin asignar'}</p>
          <p className="text-sm">Numero de factura: {order.invoice ?? 'Sin asignar'}</p>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="font-medium">Detalles de Envío</h3>
          <p className="text-sm">Método de envío: {order.shippingMethod}</p>
          <p className="text-sm">
            Punto de entrega: ({deliveryPoint?.name}). {deliveryPoint?.address},{' '}
            {deliveryPoint?.city}. {deliveryPoint?.postalCode}
          </p>
          <p className="text-sm">Destino final: {order.finalAddress}</p>
          <p className="text-sm">Cliente final: {order.finalClient}</p>
          <p className="text-sm">
            {isShippingInProgress ? 'Fecha de envío' : 'Fecha estimada de envío'}:{' '}
            {order.shippingDate?.toLocaleDateString()}
          </p>
          <p className="text-xs italic">La fecha de envío puede ser sujeta a cambios.</p>
        </div>
        {!isCentralMarketUser(session.user) && order.orderStatus === 'COMPLETED' && (
          <ConfirmArrivalButton />
        )}
      </CardContent>
    </Card>
  )
}
