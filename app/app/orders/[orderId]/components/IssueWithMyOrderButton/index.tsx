'use client'

import { Button } from '@/components/ui/Button'
import { useOrderContext } from '@/contexts/OrderContext'
import { useUser } from '@/contexts/UserContext'
import { addHistoryAction, sendMailOrderRejectedAction, updateOrderAction } from '@/utils/actions'
import { OrderStatusEnum } from '@/utils/enums'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function IssueWithMyOrderButton() {
  const router = useRouter()
  const { user } = useUser()
  const { contextOrderData: orderData, setContextOrderData } = useOrderContext()
  const [isUploading, setIsUploading] = useState(false)

  // validate with enum
  const orderStatusValue = OrderStatusEnum[orderData.orderStatus as keyof typeof OrderStatusEnum]

  if (orderStatusValue !== OrderStatusEnum.COMPLETED) {
    return <></>
  }

  const cancelOrder = () => {
    if (isUploading || !user || orderData.orderStatus === 'REJECTED') return
    setIsUploading(true)

    updateOrderAction({
      id: orderData.id,
      orderStatus: 'REJECTED',
      updatedAt: new Date()
    })
      .then((res) => {
        setContextOrderData(res[0])

        addHistoryAction({
          orderId: orderData.id,
          label: 'Orden rechazada',
          modifiedBy: user.organizationId === 1 ? 'Central Market': 'Usuario'
        })

      })
      .then(() => {
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsUploading(false)
        router.refresh()
        if (!orderData.id || !orderData.createdBy || !orderData.assignedBuyerId) return
        sendMailOrderRejectedAction(orderData.id, orderData.createdBy, orderData.assignedBuyerId)
      })
  }

  if (orderData.orderStatus === 'REJECTED') {
    return <></>
  }

  return (
    <Button variant={'destructive'} className="w-fit" onClick={cancelOrder} disabled={isUploading}>
      Reportar problema
    </Button>
  )
}

