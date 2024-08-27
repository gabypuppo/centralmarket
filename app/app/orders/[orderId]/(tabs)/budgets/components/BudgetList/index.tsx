'use client'
import type { OrderBudget } from '@/db/orders'
import React, { useEffect, useState } from 'react'
import Budget from '../Budget'
import { OrderStatusEnum } from '@/utils/enums'
import { useUser } from '@/contexts/UserContext'
import { useOrderContext } from '@/contexts/OrderContext'
import { Button } from '@/components/ui/Button'
import { addHistoryAction, sendMailBudgetApprovedAction, updateOrderAction } from '@/utils/actions'
import { useRouter } from 'next/navigation'

interface BudgetListProps {
  budgets: OrderBudget[]
}

export default function BudgetList({ budgets }: BudgetListProps) {
  const router = useRouter()
  const { user } = useUser()
  const { contextOrderData: orderData, setContextOrderData } = useOrderContext()

  const [selectedId, setSelectedId] = useState<number>()
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const selectedBudget = budgets.find((budget) => budget.id === selectedId)

    if (selectedBudget?.isRejected) setSelectedId(undefined)
  }, [budgets, selectedId])

  const updateSelectedBudgetId = () => {
    if (orderData.orderStatus !== 'BUDGETS_TO_REVIEW' || isUploading) return
    setIsUploading(true)

    const updateOrderPromise = updateOrderAction({
      id: orderData.id,
      selectedBudgetId: selectedId,
      orderStatus: 'BUDGETS_APPROVED',
      approvedAt: new Date()
    })

    const addHistoryPromise = addHistoryAction({
      orderId: orderData.id,
      label: 'Presupuesto aprobado',
      modifiedBy: user?.organizationId === 1 ? 'Central Market' : 'Usuario'
    })

    if (!orderData.id || !orderData.createdBy || !orderData.assignedBuyerId || !orderData.createdAt) {
      setIsUploading(false)
      return
    }

    sendMailBudgetApprovedAction(orderData.id, orderData.assignedBuyerId, orderData.createdAt.toISOString())

    Promise.all([updateOrderPromise, addHistoryPromise])
      .then(([order]) => {
        setContextOrderData(order[0])
        router.refresh()
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  if (!user) return <></>

  return (
    <>
      <div className="flex gap-6 overflow-auto py-2">
        {budgets.map((budget, i) => (
          <Budget key={i} budget={budget} selectedId={selectedId} setSelectedId={setSelectedId} />
        ))}
      </div>
      {OrderStatusEnum[orderData.orderStatus!] === OrderStatusEnum.BUDGETS_TO_REVIEW &&
        user?.organizationId !== 1 && (
        <Button
          className="mt-6"
          onClick={updateSelectedBudgetId}
          disabled={isUploading || selectedId === undefined}
        >
          Aceptar Presupuesto
        </Button>
      )}
    </>
  )
}
