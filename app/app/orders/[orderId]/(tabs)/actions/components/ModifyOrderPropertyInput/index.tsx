'use client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import type { Order } from '@/db/orders'
import { updateOrderAction } from '@/utils/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ModifyOrderPropertyInputParams {
  order: Order
  property: { [K in keyof Order]-?: [string] extends [Order[K]] ? K : never }[keyof Order]
  label?: string
}
export default function ModifyOrderPropertyInput({
  order,
  property,
  label
}: ModifyOrderPropertyInputParams) {
  const router = useRouter()
  const [value, setValue] = useState(order[property])
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleSave = () => {
    if (isUploading) return
    setIsUploading(true)

    updateOrderAction({
      id: order.id,
      [property]: value
    })
      .then(() => {
        setIsEditing(false)
        router.refresh()
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  return (
    <Label className="flex flex-col gap-2">
      {label}
      <div className="flex gap-2">
        <Input
          className="font-normal disabled:opacity-70"
          value={value ?? undefined}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          disabled={!isEditing}
        />
        {isEditing ? (
          <>
            <Button disabled={isUploading} onClick={handleSave}>
              Guardar
            </Button>
            <Button
              variant="secondary"
              disabled={isUploading}
              onClick={() => {
                setIsEditing(false)
                setValue(order[property])
              }}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              setIsEditing(true)
            }}
          >
            Editar
          </Button>
        )}
      </div>
    </Label>
  )
}
