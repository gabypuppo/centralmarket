'use client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useOrderContext } from '@/contexts/OrderContext'
import { addHistoryAction, sendMailModifyShippingDateAction, updateOrderAction } from '@/utils/actions'
import { useState } from 'react'

export default function ModifyShippingDateInput() {
  const { contextOrderData: orderData, setContextOrderData } = useOrderContext()
  const [date, setDate] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  const update = () => {
    if (!date) return
    setIsUploading(true)

    updateOrderAction({
      ...orderData,
      shippingDate: new Date(date)
    })
      .then((res) => {
        setContextOrderData(res[0])
        setDate('')
        addHistoryAction({
          orderId: orderData.id,
          label: `Fecha de entrega modificada a ${date}`,
          modifiedBy: 'Usuario'
        })
        if (!orderData.id || !orderData.createdBy || !orderData.assignedBuyerId || !orderData.createdAt) {
          console.error('Missing order data')
          return
        }
        sendMailModifyShippingDateAction(orderData.id, orderData.createdBy, orderData.createdAt)
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  return (
    <div className="my-6 flex flex-col gap-2">
      <h3>Puedes cambiar la fecha de entrega</h3>
      <div className="flex justify-start gap-2">
        <Input
          type="date"
          className="w-auto"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
          }}
        />
        <Button disabled={!date || isUploading} onClick={update}>
          Actualizar
        </Button>
      </div>
    </div>
  )
}
