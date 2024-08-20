'use client'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/TextArea'
import { useOrderContext } from '@/contexts/OrderContext'
import { updateOrderAction } from '@/utils/actions'
import { useState } from 'react'

export default function EditableNotes({ editable }: { editable: boolean }) {
  const { contextOrderData: orderData, setContextOrderData } = useOrderContext()
  const [inputValue, setInputValue] = useState(orderData.notes ?? '')
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = () => {
    if (isUploading || !editable) return
    setIsUploading(true)

    updateOrderAction({
      ...orderData,
      notes: inputValue
    })
      .then((res) => {
        setContextOrderData(res[0])
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  return (
    <div className="w-full flex flex-col gap-2 items-start">
      <label className="flex flex-col gap-1 w-full">
        <h3 className="font-medium">Notas</h3>
        <Textarea
          className="flex-1 text-sm"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
          }}
          disabled={!editable}
        />
      </label>
      {editable && <Button onClick={handleUpload} disabled={isUploading || orderData.notes === inputValue}>
        {orderData.notes === inputValue ? 'Guardado' : 'Guardar'}
      </Button>}
    </div>
  )
}
