'use client'

import { Button } from '@/components/ui/Button'
import { useOrderContext } from '@/contexts/OrderContext'
import { useUser } from '@/contexts/UserContext'
import { sendMailOrderCancelledAction } from '@/utils/actions'
import { addHistoryAction, updateOrderAction } from '@/utils/actions'
import { OrderStatusEnum } from '@/utils/enums'
import { useState } from 'react'

export default function CancelOrderButton() {
  const { user } = useUser()
  const { contextOrderData: orderData, setContextOrderData } = useOrderContext()
  const [isUploading, setIsUploading] = useState(false)

  // validate with enum
  const orderStatusValue = OrderStatusEnum[orderData.orderStatus as keyof typeof OrderStatusEnum]

  if (orderStatusValue >= OrderStatusEnum.BUDGETS_APPROVED) {
    return <></>
  }

  const cancelOrder = () => {
    if (isUploading || !user || orderData.orderStatus === 'CANCELLED') return
    setIsUploading(true)

    updateOrderAction({
      id: orderData.id,
      orderStatus: 'CANCELLED',
      updatedAt: new Date()
    })
      .then((res) => {
        setContextOrderData(res[0])

        return addHistoryAction({
          orderId: orderData.id,
          label: 'Orden cancelada',
          modifiedBy: user.organizationId === 1 ? 'Central Market': 'Usuario'
        })
      })
      .then(() => {})
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsUploading(false)
        if (!orderData.id || !orderData.createdBy || !orderData.assignedBuyerId || !orderData.createdAt) return
        sendMailOrderCancelledAction(orderData.id, orderData.createdBy, orderData.assignedBuyerId, orderData.createdAt)
      })
  }

  if (orderData.orderStatus === 'CANCELLED' || orderData.orderStatus === 'REJECTED') {
    return <></>
  }

  return (
    <Button variant={'destructive'} className="w-fit" onClick={cancelOrder} disabled={isUploading}>
      Cancelar solicitud
    </Button>
  )
}
