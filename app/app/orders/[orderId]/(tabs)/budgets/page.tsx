import { auth } from '@/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { addBudgets, addHistory, getBudgets, getOrderById, updateOrder } from '@/db/orders'
import { OrderStatusEnum } from '@/utils/enums'
import React from 'react'
import { Separator } from '@/components/ui/Separator'
import Dropzone from '@/components/file/Dropzone'
import BudgetList from './components/BudgetList'
import { revalidatePath } from 'next/cache'
import { Textarea } from '@/components/ui/TextArea'
import { Button } from '@/components/ui/Button'
import { sendMailBudgetsToRewiewAction } from '@/utils/actions'

interface PageProps {
  params: {
    orderId: string
  }
  
}
export default async function Page({ params }: PageProps) {
  const session = await auth()

  const orderId = parseInt(params.orderId)

  const orderPromise = getOrderById(orderId)
  const budgetsPromise = getBudgets(orderId)

  const [order, budgets] = await Promise.all([orderPromise, budgetsPromise])

  const uploadFiles = async (formData: FormData) => {
    'use server'
    const files = Array.from(formData.values()) as File[]

    await addBudgets(order.id, files)

    const requireStatusUpdate = OrderStatusEnum[order.orderStatus!] < OrderStatusEnum.BUDGETS_TO_REVIEW

    if (requireStatusUpdate) {
      await updateOrder({
        id: order.id,
        orderStatus: 'BUDGETS_TO_REVIEW',
        budgetedAt: new Date(),
        updatedAt: new Date(),
        followUpMail1DaySent: false,
        followUpMail3DaySent: false
      })
    }

    const historyPromises: ReturnType<typeof addHistory>[] = []
    const organizationId = session?.user.organizationId
    formData.forEach(() => {
      historyPromises.push(
        addHistory({
          orderId: order.id,
          label: 'Nuevo presupuesto cargado',
          modifiedBy: organizationId === 1 ? 'Central Market' : 'Usuario'

        })
      )
    })
    await Promise.all(historyPromises)

    if (!order.id || !order.createdBy || !order.assignedBuyerId || !order.createdAt ) return

    sendMailBudgetsToRewiewAction(order.id, order.createdBy, order.assignedBuyerId, order.createdAt)
    revalidatePath(`/${orderId}/budgets`)
  }

  const uploadBudgetsComments = async (formData: FormData) => {
    'use server'
    const budgetsObservations = formData.get('budgetsObservations') as string

    await updateOrder({
      id: order.id,
      budgetsObservations,
      updatedAt: new Date()
    })
    await addHistory({
      orderId: order.id,
      label: 'Comentario de presupuestos',
      modifiedBy: session?.user.organizationId === 1 ? 'Central Market' : 'Usuario'
    })

    revalidatePath(`/${orderId}/budgets`)
  }

  const isBudgetStage = OrderStatusEnum[order.orderStatus!] >= OrderStatusEnum.BUDGETS_IN_PROGRESS

  return (
    <Card>
      <CardHeader>
        <CardTitle>Presupuestos</CardTitle>
        <CardDescription>Visualiza tus presupuestos aquí.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          {isBudgetStage ? (
            budgets ? (
              budgets.length !== 0 ? (
                <BudgetList budgets={budgets} />
              ) : (
                <p>Todavía no hay presupuestos cargados.</p>
              )
            ) : (
              <p>Cargando presupuestos...</p>
            )
          ) : (
            <p>Pedido en progreso.</p>
          )}
          {isBudgetStage && session?.user.organizationId === 1 && (
            <>
              <Separator className="mt-4 mb-8" />
              <h3 className="text-lg font-medium mb-2">Cargar Presupuestos</h3>
              <Dropzone
                onSubmit={uploadFiles}
                accept={{
                  'image/png': ['.png'],
                  'application/pdf': ['.pdf']
                }}
              />
            </>
          )}
          <form
            action={uploadBudgetsComments}
            className="flex flex-col items-start gap-4"
          >
            <Textarea
              className="mt-4"
              placeholder="Comentario de presupuestos"
              name="budgetsObservations"
              rows={3}
              defaultValue={order?.budgetsObservations ?? ''}
              disabled={false}
            />
            {session?.user.organizationId === 1 && (
              <Button
                className="mt-4"
                type="submit"
              >
                Guardar Comentarios
              </Button>
            )}
          </form>

          
        

        </div>
      </CardContent>
    </Card>
  )
}
