'use client'

import { Button } from '@/components/ui/Button'
import { useOrderContext } from '@/contexts/OrderContext'
import { sendMailOrderArrivedAction, updateOrderAction } from '@/utils/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ConfirmArrivalButton() {
  const router = useRouter()
  const { contextOrderData: orderData } = useOrderContext()
  const [isUploading, setIsUploading] = useState(false)

  const confirm = () => {
    if (isUploading) return
    setIsUploading(true)

    updateOrderAction({
      ...orderData,
      isArrived: true
    }).then(() => {
      router.refresh()
    }).catch((err) => {
      console.error(err)
    }).finally(() => {
      setIsUploading(false)
      if (orderData.createdBy && orderData.assignedBuyerId && orderData.createdAt && orderData.deliveryPointId) {
        sendMailOrderArrivedAction(orderData.id, orderData.createdBy, orderData.assignedBuyerId, orderData.createdAt)
      }
    })
  }

  return (
    <Button disabled={orderData.isArrived || isUploading} onClick={confirm}>
      {orderData.isArrived ? 'Llegada confirmada' : 'Confirmar llegada'}
    </Button>
  )
}
