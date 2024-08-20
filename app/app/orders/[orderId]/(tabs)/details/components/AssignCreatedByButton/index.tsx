import { auth } from '@/auth'
import { Button } from '@/components/ui/Button'
import { updateOrder, type Order } from '@/db/orders'
import { revalidatePath } from 'next/cache'
import React from 'react'

interface AssignCreatedByButtonProps {
  order: Order
}
export default async function AssignCreatedByButton({ order }: AssignCreatedByButtonProps) {
  const session = await auth()

  const action = async () => {
    'use server'
    await updateOrder({
      id: order.id,
      createdBy: session?.user.id
    })

    revalidatePath(`/${order.id}/details`)
  }

  return (
    <form action={action}>
      <Button type="submit" variant="secondary">
        Asignármelo a mi
      </Button>
    </form>
  )
}
