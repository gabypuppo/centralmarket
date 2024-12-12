'use client'
import FileDisplay from '@/components/file/FileDisplay'
import AlertDialog from '@/components/ui/AlertDialog'
import { useOrderContext } from '@/contexts/OrderContext'
import { useUser } from '@/contexts/UserContext'
import { arrayBufferToFile } from '@/utils'
import { addHistoryAction, removeBudgetAction } from '@/utils/actions'
import { useEffect, useState } from 'react'
import RejectBudgetDialog from '../RejectBudgetDialog'
import { Button } from '@/components/ui/Button'
import type { OrderBudget } from '@/db/orders'
import { useRouter } from 'next/navigation'
import { isCentralMarketUser } from '@/auth/authorization'

interface BudgetProps {
  budget: OrderBudget
  selectedId: number | null
  setSelectedId: (budgetId: number) => void
}
export default function Budget({ budget, selectedId, setSelectedId }: BudgetProps) {
  const router = useRouter()
  const { user } = useUser()
  const { contextOrderData: orderData } = useOrderContext()
  const [file, setFile] = useState<File>()

  useEffect(() => {
    if (!budget || !budget.fileUrl) return
    fetch(budget.fileUrl)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) =>
        arrayBufferToFile(arrayBuffer, budget.fileName ?? '', budget.mimeType ?? '')
      )
      .then((file) => {
        setFile(file)
      })
  }, [budget])

  const isCentralMarket = !!user && isCentralMarketUser(user)

  const handleRemove = async () => {
    if (!user) return
    const removePromise = removeBudgetAction(budget.id)
    const historyPromise = await addHistoryAction({
      orderId: orderData.id,
      label: 'Presupuesto eliminado',
      modifiedBy: isCentralMarket ? 'Central Market' : 'Usuario'
    })

    await Promise.all([removePromise, historyPromise])
    router.refresh()
  }

  return file ? (
    <div className="flex flex-col items-center gap-4">
      <a href={budget.fileUrl ?? ''} target="_blank" className="cursor-pointer">
        <FileDisplay file={file} remove={isCentralMarket ? handleRemove : undefined} />
      </a>
      {budget.isRejected ? (
        <AlertDialog message={'Motivo: ' + budget.rejectionReason} onConfirm={async () => {}}>
          Rechazado
        </AlertDialog>
      ) : !isCentralMarket ? (
        <>
          {selectedId === budget.id || orderData.selectedBudgetId === budget.id ? (
            <Button variant="secondary" className="text-md" disabled>
              Seleccionado
            </Button>
          ) : (
            orderData.selectedBudgetId === null && (
              <Button
                variant="secondary"
                className="text-md"
                onClick={() => setSelectedId(budget.id)}
                disabled={orderData.orderStatus !== 'BUDGETS_TO_REVIEW'}
              >
                Seleccionar
              </Button>
            )
          )}
          {orderData.selectedBudgetId === null && (
            <RejectBudgetDialog budgetId={budget.id}>
              <Button className='text-sm' variant="destructive">Rechazar</Button>
            </RejectBudgetDialog>
          )}
        </>
      ) : (
        selectedId === budget.id ||
        (orderData.selectedBudgetId === budget.id && (
          <Button variant="secondary" className="text-xs" disabled>
            Seleccionado
          </Button>
        ))
      )}
    </div>
  ) : (
    <p>loading...</p>
  )
}
