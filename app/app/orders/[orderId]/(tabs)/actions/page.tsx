import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { addHistory, getOrderById, updateOrder } from '@/db/orders'
import React from 'react'
import { getFormattedLabel } from '../../../utils'
import NextOrderStateDialog from './components/NextOrderDialog'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import SelectBuyer from './components/SelectBuyer'
import ValidateInfoDialog from './components/ValidateInfoDialog'
import ModifyShippingDateInput from './components/ModifyShippingDateInput'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { sendMailGoBackToBudgetsInProgressAction } from '@/utils/actions'
import ModifyOrderParamInput from './components/ModifyOrderPropertyInput'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { revalidatePath } from 'next/cache'
import Select from '@/components/ui/Select'

interface PageProps {
  params: {
    orderId: string
  }
}
export default async function Page({ params }: PageProps) {
  const sessionPromise = auth()
  const orderPromise = getOrderById(parseInt(params.orderId))

  const [session, order] = await Promise.all([sessionPromise, orderPromise])

  if (!session || session.user.organizationId !== 1) redirect('details')
  const goBackToBudgetsInProgress = async () => {
    'use server'
    await updateOrder({
      id: order.id,
      orderStatus: 'BUDGETS_IN_PROGRESS',
      selectedBudgetId: null
    })
    await addHistory({
      orderId: order.id,
      label: 'Vuelto a presupuestos en Progreso',
      modifiedBy: 'Central Market'
    })
    if (!order.id || !order.createdBy || !order.assignedBuyerId || !order.createdAt) return
    await sendMailGoBackToBudgetsInProgressAction(
      order.id,
      order.createdBy,
      order.assignedBuyerId,
      order.createdAt
    )
    redirect('budgets')
  }
  const { orderStatus } = order

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones</CardTitle>
        <CardDescription>Realiza acciones sobre tu pedido.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex flex-col gap-2 items-start">
        <h4 className="text-lg font-semibold">{getFormattedLabel(orderStatus!)}</h4>
        {(() => {
          switch (orderStatus) {
            case 'PENDING':
              return <SelectBuyer order={order} />
            case 'ASSIGNED_BUYER':
              return <ValidateInfoDialog order={order} />
            case 'ADDITIONAL_INFORMATION_PENDING':
              return (
                <>
                  <p>El pedido necesita más información.</p>
                  <Link href="questions">
                    <Button>Hacer preguntas</Button>
                  </Link>
                  <div>
                    <ValidateInfoDialog order={order} />
                  </div>
                </>
              )
            case 'ORDER_INFORMATION_COMPLETE':
              return <NextOrderStateDialog>Avanzar a Presupuestado</NextOrderStateDialog>

            case 'BUDGETS_IN_PROGRESS':
              return (
                <Link href="budgets">
                  <Button>Cargar presupuestos</Button>
                </Link>
              )
            case 'BUDGETS_TO_REVIEW':
              return <p>Por favor, espera a que el cliente revise los presupuestos.</p>
            case 'BUDGETS_APPROVED':
              return (
                <>
                  <form action={goBackToBudgetsInProgress}>
                    <Button type="submit" className="mt-6">
                      Volver a Presupuestos en Progreso
                    </Button>
                  </form>
                  <form
                    className="flex gap-2 items-end"
                    action={async (formData) => {
                      'use server'
                      const subtotal = formData.get('subtotal') as string
                      const currency = formData.get('currency') as string
                      if (Number.isNaN(parseInt(subtotal))) return
                      await updateOrder({
                        id: order.id,
                        finalBudgetSubtotal: parseInt(subtotal),
                        finalBudgetCurrency: currency
                      })
                      revalidatePath(`/${order.id}/actions`)
                    }}
                  >
                    <Label className="flex flex-col gap-2">
                      Subtotal de Presupuesto
                      <Input
                        type="number"
                        name="subtotal"
                        placeholder={order.finalBudgetSubtotal?.toString() ?? 'Sin Cargar'}
                        required
                      />
                    </Label>
                    <Select
                      required
                      name="currency"
                      value={order.finalBudgetCurrency ?? undefined}
                      options={[
                        {
                          items: [
                            { label: 'ARS', value: 'ARS' },
                            { label: 'USD', value: 'USD' }
                          ]
                        }
                      ]}
                      placeholder="Moneda"
                    />
                    <Button type="submit">Cargar</Button>
                  </form>
                  <NextOrderStateDialog disabled={!order.finalBudgetSubtotal}>
                    Avanzar a Compra en Progreso
                  </NextOrderStateDialog>
                </>
              )
            case 'PURCHASE_IN_PROGRESS':
              return <NextOrderStateDialog>Completar Compra</NextOrderStateDialog>
            case 'PURCHASE_COMPLETED':
              return <NextOrderStateDialog>Avanzar a Envío en Proceso</NextOrderStateDialog>
            case 'SHIPPING_IN_PROGRESS':
              return (
                <>
                  <ModifyShippingDateInput />
                  <NextOrderStateDialog>El Pedido ya llego</NextOrderStateDialog>
                </>
              )
            case 'COMPLETED':
              return (
                <>
                  <p>Confirmación del cliente: {order.isArrived ? 'Si' : 'No'}</p>
                  <ModifyOrderParamInput order={order} property="remittance" label="N° Remito" />
                  <ModifyOrderParamInput order={order} property="invoice" label="N° Factura" />
                </>
              )
            case 'CANCELLED':
              return <span>El pedido ha sido cancelado.</span>
            case 'REJECTED':
              return (
                <p>Por favor, revisa tu correo electrónico para más detalles sobre la disputa.</p>
              )
            default:
              return <></>
          }
        })()}
      </CardContent>
    </Card>
  )
}
